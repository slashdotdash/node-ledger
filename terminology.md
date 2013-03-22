# Terminology

## Journal

Any file that contains Ledger data is called a “journal”. A journal mostly contains “transactions”, but it can also contain control directives, comments, and a few other things.

## Transaction

A transaction represents something that you want to enter into your journal. For example, if you just cashed a paycheck from your employer by depositing it into your bank account, this entire action is called an “transaction”. The total cost of every transaction must balance to zero, otherwise Ledger will refuse to read your journal file any further. This guarantee that no amounts can be lost due to balancing errors.

## Posting

Each transaction is made up of two or more postings (there is a special case that allows for just one, using virtual postings).

## Account

An account is any place that accumulates quantities, of any meaning. They can be named anything, the names can even contain spaces, and they can mean whatever you want. Students of accounting will use five top-level names: Equity, Assets, Liabilities, Expenses, Income. All other accounts are specified as children of these accounts. This is not required by Ledger, however, nor does it even know anything about what these names mean. That’s all left up to the user.