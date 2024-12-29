---
title: Why Congatudo?
category: General
order: 2
---

# Why Congatudo?


First of all, please do **not** try to convince people to use Congatudo.

We all know how terribly it usually turns out when people try to convince their friends to use linux on their desktop.
Using Congatudo only makes sense if you understand its goals and feel like they are important to you. Everything else will fail.


## Goals

### No cloud connectivity

Removing the cloud has a wide range of benefits.

#### No server dependency

The obvious upside of this is that all your data stays on your robot.
It also means that you won't need to have a working internet connection just to control your local vacuum robot anymore.

Commands usually execute much faster and more reliable, as they don't have to detour through some server in a datacenter
far away from you, which might be overloaded or even on fire.

Furthermore, the robot will continue working even after the vendor has ended support for that model and shut down the
corresponding servers. This is a huge issue with IoT devices. They brick all the time because the vendor 
- gets sold
- changes its business model
- runs out of venture capital
- is bankrupt
- gets hacked

and more.

Of course, if you want to use Congatudo in a container, virtual machine or Home Assistant, you have the possibility to do it.

#### No forced updates

You also don't have to fear forced firmware updates that paywall or even entirely remove a previously available feature.

Bricked devices caused by faulty forced firmware updates are also an issue that seems to happen from time to time.
One might for example push an update with extremely verbose logs enabled, leading to your flash wearing out and bricking your whole car.<br/>
You can't just not update to prevent those situations. It is also very hard/impossible to prove that a defect was caused
by the manufacturer.

Overall, forced firmware updates IMO are a very scary thing, because they clearly demonstrate that you're not the owner
of the device you've bought. One might argue that you also buy this "managed update service" with the device, however
it is not a service because you cannot opt out.

#### No account required

By using Congatudo, you don't need to give anyone your phone number or e-mail address just to use the robot you've bought.
This way, it will never be part of a data breach as it was never stored in the first place.

You also don't have to periodically read some hard to understand 200-page ToS where you're basically forced to agree to
whatever the vendor wants from you as there often is no way to deny it while continuing to use the product.

#### No marketing

With Congatudo, you won't get any ads. You won't get push notifications notifying you about new product launches.
You won't get nagged by your property to upgrade to a new model or buy this new accessoire for your existing one.

You also won't get emails from a third party trying to cross-sell you something.

#### Downsides

The downside of not using the manufacturer-provided cloud services is that now you're responsible for installing (security)
updates, allowing for remote connectivity to e.g., control your robot while not at home etc.<br/>
All that fancy cloud stuff.


### Open Knowledge

Congatudo is open-source under a permissive license. You're free to understand, copy, and modify Congatudo as you like.
There's a lot of documentation. The code is pretty well-structured and features comments where required.


You don't have to look at the bottom of a locked filing cabinet stuck in a disused lavatory with a sign on the door saying
"Beware of the Leopard" just to understand Congatudo. Nothing is hidden from you to purposely create a situation
of asymmetric information.


Even if GitHub goes down it doesn't matter.<br/>
Git is decentralized by default. Use a local backup. Use a backup somewhere else.<br/>
On that note, check out the [Software Heritage](https://softwareheritage.org) project.