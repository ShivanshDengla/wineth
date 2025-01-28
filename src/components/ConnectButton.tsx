import { ConnectButton } from "@rainbow-me/rainbowkit";

interface ConnectProps {
  connectText: string;
}
export const MyConnect: React.FC<ConnectProps> = ({ connectText }) => {
  const styles = {
    button: {
      alignItems: "center",
      justifyContent: "center",
      fontSize: "16px",
      padding: "6px 12px",
      borderRadius: "14px",
      border: "none",
      backgroundColor: "#2A2A5B",
      color: "#FFFCFC",
      cursor: "pointer",
      marginTop: "5px",
    },
  };
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If app doesn't use authentication,
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <>
            <div
              {...(!ready && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}>
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="hover-button"
                      style={styles.button}>
                      {connectText}
                    </button>
                  );
                }
                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      style={styles.button}>
                      Wrong network
                    </button>
                  );
                }
                return (
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={openChainModal}
                      style={{ display: "flex", ...styles.button }}
                      type="button"
                      className="hidden md:flex">
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 20,
                            height: 20,
                            borderRadius: 999,
                            overflow: "hidden",
                            marginRight: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          className="md:w-[14px] md:h-[14px] md:pl-0 md:mr-1">
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              style={{ width: "100%", height: "100%" }}
                            />
                          )}
                        </div>
                      )}
                      <span className="hidden md:inline ml-1">{chain.name}</span>
                    </button>
                    <button
                      onClick={openAccountModal}
                      type="button"
                      style={styles.button}
                      className="text-sm md:text-base">
                      {account.displayName}
                      {/* {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''} */}
                    </button>
                  </div>
                );
              })()}
            </div>
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};
