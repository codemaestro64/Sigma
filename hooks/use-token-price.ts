'use client';

import { useContractRead } from 'wagmi';
import { FAIR_LAUNCH_ABI } from '@/lib/contracts/FairLaunch';
import { FAIR_LAUNCH_ADDRESS } from '@/lib/contracts/addresses';
import { formatEther, parseEther } from 'viem';
import { useState, useEffect } from 'react';

export function useTokenPrice(tokenAddress: string) {
  const [ethUsdPrice, setEthUsdPrice] = useState(0);
  const { data: priceData } = useContractRead({
    address: FAIR_LAUNCH_ADDRESS,
    abi: FAIR_LAUNCH_ABI,
    functionName: 'getEthOut',
    args: [tokenAddress, parseEther('1')],
  });

  const priceInEth = priceData ? formatEther((priceData as [bigint, bigint])[1]) : '0';

  useEffect(() => {
    fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD')
      .then(response => response.json())
      .then(data => setEthUsdPrice(data.USD))
      .catch(error => console.error('Error fetching ETH price:', error));
  }, []);

  return {
    priceInEth,
    ethUsdPrice,
  };
}
