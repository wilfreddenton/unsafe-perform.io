https://www.bloomberg.com/news/features/2021-10-07/crypto-mystery-where-s-the-69-billion-backing-the-stablecoin-tether

https://bitfinexed.medium.com/bitfinex-never-repaid-their-tokens-bitfinex-started-a-ponzi-scheme-86a9291add29

https://www.bitfinex.com/wp-2019-05.pdf

https://www.bloomberg.com/news/articles/2022-02-08/cryptocurrency-of-hacked-exchange-surges-59-after-fund-recovery
https://www.bitfinex.com/posts/766

https://www.youtube.com/watch?v=bxFVtipNydo

https://www.bitfinex.com/wp-2019-05.pdf

https://coinmarketcap.com/currencies/unus-sed-leo/

# Bitfinex

For those who have the ability to ignore cyptocurrency news, the United States Department of Justice published a press release from February 8th 2022: *Two Arrested for Alleged Conspiracy to Launder $4.5 Billion in Stolen Cryptocurrency*[^DOJ-press-release].

> According to court documents, Lichtenstein and Morgan allegedly conspired to launder the proceeds of 119,754 bitcoin that were stolen from Bitfinex’s platform after a hacker breached Bitfinex’s systems and initiated more than 2,000 unauthorized transactions.

Notice the language used here: "stolen from Bitfinex's platform" not "stolen from Bitfinex". The coins belonged to the users of the platform and not the platform itself. Unfortunately for them, the old "not your keys, not your coins" adage rung true.

The hack was reported by Bitfinex on August 2nd 2016[^security-breach].

> Today we discovered a security breach that requires us to halt all trading on Bitfinex, as well as halt all digital token deposits to and withdrawals from Bitfinex.

If this was heart-wrenching for Bitfinex users to read, the update published four days later would give them a full-on heart attack.

> After much thought, analysis, and consultation, we have arrived at the conclusion that losses must be generalized across all accounts and assets. This is the closest approximation to what would happen in a liquidation context. Upon logging into the platform, customers will see that they have experienced a generalized loss percentage of 36.067%. In a later announcement we will explain in full detail the methodology used to compute these losses[^security-breach-update].

Bitfinex had determined that the roughly 100,000 Bitcoins yoinked from their coffers amounted to 36% of their total holdings and spread that loss across all their users. They gave them a "haircut" so to speak. Suppose a user `ShrekIsLove` had 3BTC on Bitfinex before the hack. When they were finally able to access their account again, they would see a balnce of roughly 2BTC. This is regardless of their specific Bitcoin being part of the ~100,000 that was stolen or not.

Enter, BFX token. The first of three tokens created by Bitfinex to wash their hands of the hack.

> In place of the loss in each wallet, we are crediting a token labeled BFX to record each customer’s discrete losses. Tokens will be distributed without release or waiver. The BFX tokens will remain outstanding until redeemed in full by Bitfinex or possibly exchanged—upon the creditor’s request and Bitfinex’s acceptance—for shares of iFinex Inc[^security-breach].

Note the term "discrete losses" as opposed to "continuous losses". This means they took a snapshot of the current BTC price in USD and used that to calculate each user's losses. So from Bitfinex'es perspective our friend `ShrekIsLove` lost roughly $600 not 1BTC. It seems that `1BTC == 1BTC` until shit hits the fan. In 2021 Bitcoin reached an all time high of nearly $69,000.

So now `ShrekIsLove`'s account balances should report roughly 2BTC and 600BFX. They have three options going forward:

1. Hold their BFX tokens in the hopes that Bitfinex would redeem them for the full amount,
2. sell them for cents on the dollar to other traders,
3. or convert them to iFinex shares. 

Bitfinex was redeeming BFX tokens but at a slow rate [^redemption-slow]. As a result, they were traded for around 30 cents on the dollar[^30-cents]. Sellers wanted to recoup a portion of their losses and be done with the ordeal whereas buyers and holders were betting that iFinex would repurchase the tokens for the full dollar amount. iFinex partnered with a company called BankToTheFuture to create a Special Purpose Vehicle [SPV], which I assume must be a rocket that takes those onboard to the moon, to convert BFX tokens into equity[^spv]. iFinex wanted their users to convert as this would reduce the number of BFX tokens they were obligated to redeem regardless of the recovery of stolen funds. To push users in this direction they introduced the second of three tokens called the Recovery Right Token [RRT]. 

> If subscribed on or before October 7, 2016, each investor will get 1 RRT for each BFX token exchanged for shares;
> If subscribed after October 7, 2016, and on or before October 31, 2016, each investor will get ½ an RRT for each BFX token exchanged for shares;
> If subscribed after October 31, 2016, and on or before November 30, 2016, each investor will get ¼ an RRT for each BFX token exchanged for shares; and,
> If subscribed after November 30, 2016, no RRTs will be delivered[^rtt].

This FOMO based scheme incentivised users to convert to shares quickly. The longer users held their BFX in the hopes of redemption, the fewer RRTs they'd receive if they ended up converting. If the stolen coins were recovered, iFinex promised to repurchase any remaining BFX tokens first, and then repurchase the RRTs. If a user thought it unlikely that their BFX tokens would be redeemed before a recovery of funds, then the RRTs looked almost identical.

*We continue by going through the specific user story how he's a US citizen and a basic level account and how that influences his decision making and the hoops he had to jump through.

Users who were taking advantage of Bitfinex's lack of KYC[^no-kyc] were limited to these first two paths. BankToTheFuture has a KYC process so users who were pseudonymous would need to come out of the shadows to convert their tokens[^bttf-kyc].

Unfortunately for them, they got baited. Once enough of these users took the equity and RRTs, waiving their rights to pre-recovery redemption, iFinex bought up all the remaining BFX tokens for the full $1.00 price and patted themselves on the back[^100-redemption]. The users who held their BFX tokens had their discrete losses recouped and those who bought more BFX tokens could have recouped their continuous losses and perhaps even made a significant profit--💎🙌.

> A combination of factors has led to this seminal moment for Bitfinex, including a dramatic uptick in equity conversions; record operating results in March; and, the decision to reduce our reserves in favor of this opportunity. We are tremendously grateful to all of our customers and new shareholders for helping us get to this point. By the end of this week, we will be sending notes directly to our shareholders with more information about what to expect in the coming months.

So what can `ShrekIsLove` do now?

iFinex is also the owner of Tether. Tether is a stablecoin pegged to $1.00. Tether is supposed to be redeemable for $1.00 

I find it a bit odd since not only did they issue a bunch of unregulated securities to wash their hands of the hack they also print tether like J-Pow is working there.

It's going to be some time before we can say "It's all ogre now".

Just like BFX tokens these RRTs were also tradeable[^RRT-tradeable].

> For Bitfinex, BFX and this clause, if it holds up in Court, would permit them to generate a debt instrument out of pure imagination, give it a totally arbitrary valuation, dump it on victims, let the market value it as a contingent notional asset (i.e. unlikely to realize value) and then, when the holders try to get any value of it by trading, they lose both the difference between the arbitrary valuation and the actual realizable value (which really represents the loss they take from the hack), AND THEY LOSE THEIR RIGHT TO SUE. For Bitfinex, this permits them to buy back the debt at a fraction of cost and get full releases against the issued value.

In an ideal world, these coins would be returned directly to those who held them prior to the August 2016 hack. Unfortunately it will be very difficult for the DOJ to setup a system to do this accurately. I still believe this is the right thing to do. Giving the coins to Bitfinex will not make the original holders whole it.

Earlier this week the US govt recovered.... Allegedly this girl boss stole it with her husband.

Headlines didn't say it but after reading the DOJ press release I noticed this was Bitfinex's stolen Bitcoin!

And of course UNUS SED LEO got a massive pump. WTF is UNUS SED LEO you're asking? To answer that we'll have to go back to August 2nd 2016.

## Security Breach

> Today we discovered a security breach that requires us to halt all trading on Bitfinex, as well as halt all digital token deposits to and withdrawals from Bitfinex.

Imagine being an "early" adopter in an unproven cryptocurrency with a significant amount of your sitting on the chain.

> The theft is being reported to — and we are co-operating with — law enforcement.

Probably the first and last time they "co-operated".

## A Very Expensive Haircut

> After much thought, analysis, and consultation, we have arrived at the conclusion that losses must be generalized across all accounts and assets. This is the closest approximation to what would happen in a liquidation context. Upon logging into the platform, customers will see that they have experienced a generalized loss percentage of 36.067%. In a later announcement we will explain in full detail the methodology used to compute these losses.

Instead of figuring out the problem they put it on their users. Every user would lose 36.067% of all their holdings. In short, they got Bitfinex'ed.

But as we all know, a new token can solve any problem! Bitfinex created the BFX token and distributed them to their wounded userbase. Say Chloe had 3BTC at the time of the hack. They now have roughly 2BTC. That is a loss of roughly $600 at the time (man I should have bought Bitcoin in 2016). So Bitfinex awarded them with 600 BFX tokens.
 
So now, most users have either traded away their tokens for pennies on the dollar, converted to equity, or in very rare cases been redeemed by Bitfinex. The company is able to pat themselves on the back and say they've fulfilled their moral obligations to their users and that there are no more BFX tokens.

To incentivise users to convert to equity they created another token called RRT.

## RRT

They said they would redeem those tokens for real dollars when they were able to. Our friend Chloe held their 2BTC and 600RRT for all these years, Bitfinex receives the unstollen coins from the government and they exchange Chloe's 600BFX for 600USD. Well that's stil a "loss" of about $34,000 because Bitcoin isn't worth $600 now it's worth $40,000. But BFX tokens do not exist. Shortly after these tokens were distributed, Bitfinex strongly encouraged the token holders to convert to iFinex equity. 1BFX for 1 share of private equity. Why this price? Because Bitfinex said so.

For Bitfinex, this is a fantastic position to be in. Not only did they put the vast majority of their loss on the users, they no longer have any obligation to pay their users back in the event that the funds are returned.

# UNUS SED LEO

> Our ‘Unus sed leo’ ethos means we stand and move boldly and bravely, doing everything in our power to do right by our customers and the community at large in the face of adversity.

Because greed in this space is insatiable. They decided to raise funds by offering a token sale. USL is the fuel of a sort of scammy rewards programs. Holders of this coin can get discounts and stuff. Usually when real companies want to raise money they have to sell equity or debt but when you're operating in the cryptosphere (metaverse?) you can just conjure tokens out of thin air that come with no legal obligation or regulatory scrutiny whatsoever. All upside, no downside.

> Bitfinex took a unique approach, allocating the losses across all accounts and crediting specially-designed BFX tokens to customers at a ratio of 1 BFX to 1 dollar lost. Bitfinex honoured its commitment to repay the losses. Within eight months of the security breach, all BFX token holders had their tokens redeemed at 100 cents on the dollar, or had exchanged their tokens, directly or indirectly, for shares of the capital stock of iFinex Inc. All BFX tokens were redeemed and destroyed through this process. 
https://www.bitfinex.com/legal/token-terms/rrt

> As of November 30, 2016, the total number of RRTs issued and outstanding is equal to 30,199,822.40.

It's like that meme where the guy wakes up from a coma and asks how much is Bitcoin worth. This hack and subsequent recovery may have been the best timeline for Bitfinex. Take 30% of your users Bitcoin. Send them into the ether for 6 years so you can't sell them. Only pay back your users the dollar amount they lost. Profit immensely.

Ironic that the government now has to decide whether to give a company that's counterfited 10s of billions of dollars billions of dollars.

[^DOJ-press-release]: [Two Arrested for Alleged Conspiracy to Launder $4.5 Billion in Stolen Cryptocurrency](https://www.justice.gov/opa/pr/two-arrested-alleged-conspiracy-launder-45-billion-stolen-cryptocurrency)

[^security-breach]: [Security Breach](https://www.bitfinex.com/posts/123)

[^security-breach-update]: [Security Breach - Update 3](https://www.bitfinex.com/posts/129)

[^milkshake]: [I Drink Your Milkshake](https://medium.com/decentralize-today/on-bitfinexs-bfx-disclosures-4dd9949e8f39)

[^rrt]: [Bitfinex Recovery Right Tokens](https://blog.bitfinex.com/announcements/bitfinex-recovery-right-tokens/)

[^RRT-tradeable]: [RRT Exchange Trading Enabled](https://www.bitfinex.com/posts/153)

[^30-cents]: [What do with BFX tokens? (Reddit Post)](https://www.reddit.com/r/BitcoinMarkets/comments/4x68rk/what_do_with_bfx_tokens_is_there_anything_that/)

[^no-kyc]: [Verification](https://support.bitfinex.com/hc/en-us/articles/115003424209-Verification-Frequently-asked-questions-FAQ-)

[^redemption-slow]: [Redemption of 5.00% of BFX Tokens](https://www.bitfinex.com/posts/193)

[^100-redemption]: [100% Redemption of Outstanding BFX Tokens](https://www.bitfinex.com/posts/198)

[^spv]: [Special Purpose Vehicle (SPV) Opportunities ](https://www.bitfinex.com/posts/147)

[^bttf-kyc]: [Who can use BnkToTheFuture.com?](https://bnktothefuture.freshdesk.com/support/solutions/articles/9000164098-who-can-use-bnktothefuture-com-)
