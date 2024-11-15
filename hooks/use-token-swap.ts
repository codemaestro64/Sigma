'use client';

import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount, useBalance, usePublicClient } from 'wagmi';
import { FAIR_LAUNCH_ABI } from '@/lib/contracts/FairLaunch';
import { FAIR_LAUNCH_ADDRESS } from '@/lib/contracts/addresses';
import { FAIR_LAUNCH_ERC20_TOKEN_ABI } from '@/lib/contracts/FairLaunchErc20Token';
import { parseEther, formatEther } from 'viem';

export function useTokenSwap(tokenAddress: string, isBuying: boolean) {
  const [amount, setAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('0');
  const { address: userAddress } = useAccount();
  const publicClient = usePublicClient();

  // Balance hooks need to be declared before they're used
  const { refetch: refetchEthBalance } = useBalance({
    address: userAddress,
  });

  const { refetch: refetchTokenBalance } = useBalance({
    address: userAddress,
    token: tokenAddress as `0x${string}`,
  });

  // Contract reads
  const { data: allowance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: FAIR_LAUNCH_ERC20_TOKEN_ABI,
    functionName: 'allowance',
    args: userAddress && !isBuying ? [userAddress, FAIR_LAUNCH_ADDRESS] : undefined,
    enabled: !!userAddress && !isBuying,
    watch: true,
  });

  // For Buy: Calculate tokens out when ETH amount changes
  const { data: tokensOutData } = useReadContract({
    address: FAIR_LAUNCH_ADDRESS,
    abi: FAIR_LAUNCH_ABI,
    functionName: 'getTokensOut',
    args: amount && isBuying ? [tokenAddress, parseEther(amount)] : undefined,
    enabled: !!amount && !!tokenAddress && isBuying,
    watch: true,
  });

  // For Sell: Calculate ETH out when token amount changes
  const { data: ethOutData } = useReadContract({
    address: FAIR_LAUNCH_ADDRESS,
    abi: FAIR_LAUNCH_ABI,
    functionName: 'getEthOut',
    args: amount && !isBuying ? [tokenAddress, parseEther(amount)] : undefined,
    enabled: !!amount && !!tokenAddress && !isBuying,
    watch: true,
  });

  // Update receive amount based on buy/sell mode
  useEffect(() => {
    if (!amount) {
      setReceiveAmount('0');
      return;
    }

    if (isBuying && tokensOutData) {
      const [tokenAmount] = tokensOutData as [bigint, bigint, bigint];
      setReceiveAmount(formatEther(tokenAmount));
    } else if (!isBuying && ethOutData) {
      const [ethAfterFee] = ethOutData as [bigint, bigint];
      setReceiveAmount(formatEther(ethAfterFee));
    }
  }, [amount, tokensOutData, ethOutData, isBuying]);

  const { writeContractAsync, isPending: isWritePending } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleBuy = async () => {
    if (!amount || !tokenAddress || !writeContractAsync) {
      console.log('Buy prerequisites not met:', { 
        amount, 
        tokenAddress, 
        writeContractAsync: !!writeContractAsync,
      });
      return;
    }
    
    try {
      const config = {
        address: FAIR_LAUNCH_ADDRESS,
        abi: FAIR_LAUNCH_ABI,
        functionName: 'buyTokens',
        args: [tokenAddress],
        value: parseEther(amount),
      } as const;

      console.log('Attempting buy with config:', config);
      
      try {
        const hash = await writeContractAsync(config);
        console.log('Transaction hash:', hash);
        setTxHash(hash);
      } catch (writeError) {
        console.error('Error in writeContractAsync:', writeError);
        throw writeError;
      }

    } catch (error: any) {
      console.error('Error buying tokens:', error);
      if (error.message?.includes('User rejected the request')) {
        console.log('Transaction rejected by user');
        return;
      }
      throw error;
    }
  };

  // Effect to handle successful transactions
  useEffect(() => {
    if (isSuccess) {
      Promise.all([
        refetchEthBalance(),
        refetchTokenBalance(),
      ]).then(() => {
        setAmount('');
        setTxHash(undefined);
      });
    }
  }, [isSuccess, refetchEthBalance, refetchTokenBalance]);

  const handleSell = async () => {
    if (!amount || !tokenAddress || !writeContractAsync) {
      console.log('Sell prerequisites not met:', { 
        amount, 
        tokenAddress, 
        writeContractAsync: !!writeContractAsync,
      });
      return;
    }
    
    try {
      const requiredAmount = parseEther(amount);
      
      // Check if we need approval first
      if (!allowance || BigInt(allowance) < BigInt(requiredAmount)) {
        console.log('Approving tokens...');
        
        const approveConfig = {
          address: tokenAddress,
          abi: FAIR_LAUNCH_ERC20_TOKEN_ABI,
          functionName: 'approve',
          args: [FAIR_LAUNCH_ADDRESS, requiredAmount],
        } as const;

        const approveHash = await writeContractAsync(approveConfig);
        console.log('Approve transaction hash:', approveHash);
        setTxHash(approveHash);

        // Wait for approval to be confirmed before selling
        if (publicClient) {
          await publicClient.waitForTransactionReceipt({
            hash: approveHash,
          });
        }
      }

      // Execute sell
      const sellConfig = {
        address: FAIR_LAUNCH_ADDRESS,
        abi: FAIR_LAUNCH_ABI,
        functionName: 'sellTokens',
        args: [tokenAddress, requiredAmount],
      } as const;

      console.log('Selling tokens...');
      const sellHash = await writeContractAsync(sellConfig);
      console.log('Sell transaction hash:', sellHash);
      setTxHash(sellHash);

    } catch (error: any) {
      console.error('Error in sell process:', error);
      if (error.message?.includes('User rejected the request')) {
        console.log('Transaction rejected by user');
        return;
      }
      throw error;
    }
  };

  return {
    amount,
    setAmount,
    receiveAmount,
    handleBuy,
    handleSell,
    isConfirming: isWritePending || isConfirming,
    isBuySuccess: isSuccess,
    isSellSuccess: isSuccess,
    needsApproval: !isBuying && allowance && amount ? 
      BigInt(parseEther(amount)) > BigInt(allowance) : 
      false,
    userAddress,
  };
}
