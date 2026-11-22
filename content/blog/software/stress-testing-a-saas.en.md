---
date: '2026-11-22'
draft: false
title: 'How I Prepared a SaaS for Its Next Traffic Spike'
summary: 'A ticket sale drew ten times the demand of earlier sales. How I used k6, AWS, and repeated load tests to prepare the platform for the next sale.'
categories:
- Software Development
- Technology
---

I was advising a ticketing startup when a futsal semifinal drew **ten times the demand of earlier ticket sales**. The club opened sales without notifying the platform team. By the time we saw how many people were trying to buy, 60% to 70% of purchase attempts were already failing with a message that too many people were trying to buy from the same ticket tier. The payment gateway blocked the account for making too many requests, and for 14 minutes the platform could generate no Pix payment codes.

The PostgREST connection pool was the first suspect because it kept showing up in the logs. Looking at the whole flow, I found three problems happening at once. Ticket reservations held a lock while making HTTP calls, the payment service derived the same encryption key several times per purchase, and each Pix payment took six to nine calls to the gateway. The provider enforced its limit per account, so adding servers to make the same calls would only get the account to that limit faster.

Sales resumed when the gateway unblocked the account. Before the next launch, I needed to know how many people the system could serve per minute, how long they would wait, and whether each confirmed payment would still result in a valid ticket.

## Recreating the sales launch

A stress test pushes a system beyond its usual load to find where performance degrades and what happens to work already in progress. Here, the test had to recreate competition for tickets. When a tier sells out, buyers try the next one. While they wait for their Pix payment to clear, the portal checks its status. Every buyer creates work in several parts of the system.

I used [k6](https://grafana.com/oss/k6/) because I could describe that journey in code, control the arrival rate, and repeat the scenario after each change. I set up 8,500 simulated buyers competing for about 5,490 tickets. Five thousand arrived in the first five minutes. The rest arrived over the next ten. The most complete runs covered the waiting room, switching ticket tiers, checkout, and the portal's status checks through payment confirmation.

Generating that load required plenty of CPU for a short time. On AWS, I spun up a temporary EC2 instance, loaded the k6 runners and the gateway simulator, ran the test, and terminated the instance at the end of the cycle. The load generator ran separately from the application, so it had its own CPU capacity.

On the platform I created a **stress-test club**, with its own test buyers, tickets, and charges. The security exceptions required for the exercise, such as exempting simulated traffic from the platform's own rate limit, applied only to that club. The gateway simulator enforced the provider's quotas and delivered confirmations one at a time, as the real provider did. Other clubs shared the production environment, so I monitored their operations and set up a way to stop the test if their service began to degrade.

## What each round revealed

Before running the test, I defined what counted as success. I measured **purchases per minute, time in the waiting room, and time from admission to seeing the Pix QR code**. I used k6 metrics to see what buyers experienced and metrics in Prometheus and Grafana to locate saturation. After each run, I reconciled the simulator's charges against the database. Every confirmed payment had to have a corresponding ticket, with zero duplicate charges and zero overselling.

Before the larger runs, I worked on the checkout flow. To reduce work per purchase, I derived the encryption key once per process, reused existing customer records, and reduced repeat purchases to two gateway calls. I also moved email sending out of payment confirmation, saved the charge ID before fetching the QR code, and added a waiting room at the entrance to the sale. Even after those changes, the first bursts on the old VPS produced **40% to 56% timeouts**. I also fixed a sold-out check that was causing the queue status endpoint to time out. In a subsequent run, the platform reached **266 purchases per minute**, with an average wait of **6 min 37 s**.

With that baseline measured, I looked for where the time was still going. I adjusted our internal limiter based on the limits the provider had confirmed. In another round, I replaced HTTP calls to PostgREST with a direct PostgreSQL connection pool and cut logging and Redis overhead. Together, those changes brought checkout time after admission down from 4.9 to 2.7 seconds. I also added indexes for queries that were scanning entire tables. Adding Pix status checks to the scenario showed how much load the portal still generated after the charge had been created.

With those changes in place, the test passed on Sunday night. When I repeated the run on Monday with the same code and the same load, the system collapsed. The difference showed up in *CPU steal*, the time a virtual machine is ready to run while the hypervisor is using the processor elsewhere. The old VPS reached **41% steal while idle**. I used copies of the same stack to compare AWS instances and set a target of 500 admissions per minute under the full workload. I chose the cheapest configuration that passed.

## The admission rate we used for the sale

After the migration, the portal workload showed that every availability check recounted the tickets in each tier. I added a two-second cache for repeated reads and kept the count fresh when buyers selected or changed tiers. For the next run, I also adjusted the scenario to reflect how static assets are normally served through the CDN.

A production test with buyers who already had records in the simulator completed **5,068 purchases in about 11 minutes**, roughly **470 per minute**. The 95th-percentile wait was **4 min 03 s**. Once admitted, buyers saw the QR code in a median of **3.9 seconds**. The records reconciled, and the run finished without 5xx or 429 responses.

I also tested 600 admissions per minute. The queue moved faster, but checkout slowed after admission and another club recorded a failure during the spike. I kept the real sale at **500 admissions per minute**.

At the next sale, the waiting room, checkout, Pix confirmation, and ticket delivery worked end to end without manual intervention. Before sales opened, I knew how much traffic to admit, what to watch during the spike, and when to slow admissions to protect the other clubs.

## From one machine to scaling on demand

Early in its operations, the startup got the platform running quickly on self-hosted Supabase. The move to AWS kept that architecture in place. I proposed this transition, and we’re now gradually replacing PostgREST calls with our own APIs. The payment service has already taken the first step by connecting directly to PostgreSQL.

The next step is to separate the applications from the database and prepare the payment service to run across multiple replicas. A more cloud-native AWS architecture will let application capacity grow when tickets go on sale and shrink as demand subsides. The same load scenario will show how much each configuration can handle and how long buyers have to wait.

When the test passed on Sunday and failed on Monday, the load and the code were the same. Measuring how much CPU the VPS actually delivered explained why the result changed. Simulating a spike makes it possible to repeat that kind of comparison before the next sale. The first run shows where to look. The measurements guide the hypothesis and the change. The next run shows whether the system serves more buyers, whether the wait gets shorter, and whether each payment still results in a valid ticket.
