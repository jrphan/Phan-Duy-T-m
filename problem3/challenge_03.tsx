interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Added blockchain field
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Previously:
  // const getPriority = (blockchain: string): number => {
  //   switch (blockchain) {
  //     case "Osmosis":
  //       return 100;
  //     case "Ethereum":
  //       return 50;
  //     case "Arbitrum":
  //       return 30;
  //     case "Zilliqa":
  //       return 20;
  //     case "Neo":
  //       return 20;
  //     default:
  //       return -99;
  //   }
  // };

  // Prefer using string instead of any
  // Syntax optimization:  Map blockchain names to their corresponding priorities
  const getPriority = (blockchain: string): number => {
    const priorityMap: Record<string, number> = {
      Osmosis: 100,
      Ethereum: 50,
      Arbitrum: 30,
      Zilliqa: 20,
      Neo: 20,
    };

    return priorityMap[blockchain] || -99;
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // Previously:
        // if (lhsPriority  > -99) {
        //   if (balance.amount <= 0) {
        //     return true;
        //   }
        // }
        // return false;

        // Optimized condition (lhsPriority is not defined, We will use balancePriority to check the condition)
        return balancePriority > -99 && balance.amount <= 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        } else {
          // Return 0 when priorities are equal to avoid errors
          return 0;
        }
      });
    // Previously:
    // }, [balances, prices]);
  }, [balances]); // Only balances is required as a dependency

  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed(),
      };
    });
  }, [sortedBalances]); // Recompute formattedBalances when sortedBalances changes

  // Previously: const rows = formattedBalances.map(
  // Use formattedBalances instead of sortedBalances (already formatted and includes formatted field)
  const rows = formattedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      // Make sure prices[balance.currency] is defined,
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row} //classes is not defined
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
