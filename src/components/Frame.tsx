'use client';

import { useEffect, useCallback, useState } from 'react';
import sdk from '@farcaster/frame-sdk';
import {
  useAccount,
  useSendTransaction,
  useSignMessage,
  useWaitForTransactionReceipt,
  useDisconnect,
  useConnect,
} from 'wagmi';

import { framesConfig } from './providers/FramesProvider';
import { Button } from './ui/Button';
import { truncateAddress } from '../lib/truncateAddress';
import Image from 'next/image';
import { ADDRESS } from '../constants/address';

export default function Frame() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<any>();
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const {
    sendTransaction,
    error: sendTxError,
    isError: isSendTxError,
    isPending: isSendTxPending,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

  const {
    signMessage,
    error: signError,
    isError: isSignError,
    isPending: isSignPending,
  } = useSignMessage();

  const { disconnect } = useDisconnect();
  const { connect } = useConnect();

  useEffect(() => {
    const load = async () => {
      try {
        setContext(await sdk.context);
        sdk.actions.ready();
      } catch (e) {
        console.error("Error loading Farcaster SDK:", e);
      }
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  const openUrl = useCallback(() => {
    sdk.actions.openUrl('https://wineth.org');
  }, []);

  const close = useCallback(() => {
    sdk.actions.close();
  }, []);

  const sendTx = useCallback(() => {
    sendTransaction(
      {
        to: ADDRESS.VAULT.ADDRESS,
        data: '0x',
        value: BigInt(1000000000000000), // 0.001 ETH
      },
      {
        onSuccess: (hash) => {
          setTxHash(hash);
        },
      }
    );
  }, [sendTransaction]);

  const sign = useCallback(() => {
    signMessage({ message: 'Hello from winEth!' });
  }, [signMessage]);

  const toggleContext = useCallback(() => {
    setIsContextOpen((prev) => !prev);
  }, []);

  const renderError = (error: Error | null) => {
    if (!error) return null;
    return <div className="text-red-500 text-xs mt-1">{error.message}</div>;
  };

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <div className="flex justify-center mb-4">
        <Image
          src="/images/wineth.png"
          height={0}
          width={125}
          alt="WinEth Logo"
          className="h-auto"
        />
      </div>
      
      <h1 className="text-xl font-bold text-center mb-4">winEth | PoolTogether Charity Vault</h1>

      <div className="mb-4">
        <h2 className="text-lg font-bold">Actions</h2>

        <div className="mb-4">
          <Button onClick={openUrl} className="w-full mt-2">
            Visit winEth Website
          </Button>
        </div>

        <div className="mb-4">
          <Button onClick={close} className="w-full mt-2">
            Close Frame
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold">Wallet</h2>

        {address && (
          <div className="my-2 text-sm">
            Connected: <span className="font-mono">{truncateAddress(address)}</span>
          </div>
        )}

        <div className="mb-4">
          <Button
            onClick={() =>
              isConnected
                ? disconnect()
                : connect({ connector: framesConfig.connectors[0] })
            }
            className="w-full mt-2"
          >
            {isConnected ? 'Disconnect' : 'Connect Wallet'}
          </Button>
        </div>

        {isConnected && (
          <>
            <div className="mb-4">
              <Button
                onClick={sendTx}
                disabled={!isConnected || isSendTxPending}
                isLoading={isSendTxPending}
                className="w-full mt-2"
              >
                Donate 0.001 ETH
              </Button>
              {isSendTxError && renderError(sendTxError)}
              {txHash && (
                <div className="mt-2 text-xs">
                  <div>Transaction: {truncateAddress(txHash)}</div>
                  <div>
                    Status:{' '}
                    {isConfirming
                      ? 'Confirming...'
                      : isConfirmed
                      ? 'Confirmed!'
                      : 'Pending'}
                  </div>
                </div>
              )}
            </div>
            <div className="mb-4">
              <Button
                onClick={sign}
                disabled={!isConnected || isSignPending}
                isLoading={isSignPending}
                className="w-full mt-2"
              >
                Sign Message
              </Button>
              {isSignError && renderError(signError)}
            </div>
          </>
        )}
      </div>
      
      <div className="mt-6 text-xs text-center text-gray-500">
        Contribute to a good cause while saving and winning with PoolTogether
      </div>
    </div>
  );
} 