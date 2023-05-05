import React, { useEffect, useState } from "react";
import "./App.css";
import useModal from "./useModal";
import Modal from "./Modal";
import nearLogo from "./assets/near-logo.svg";
import * as nearAPI from "near-api-js";

const initialValues = {
  assetTitle: "",
  assetDescription: "",
  assetUrl: "",
  assetPrice: "",
  assetBid: "",
};

const App = ({ currentUser, nearConfig, walletConnection }) => {
  const {
    utils: {
      format: { parseNearAmount },
    },
  } = nearAPI;
  const [showLoader, setShowLoader] = useState(false);
  const [values, setValues] = useState(initialValues);
  

  const {
    isVisible,
    isVisibleSale,
    isVisibleBid,
    toggleModal,
    toggleSaleModal,
    toggleBidModal,
  } = useModal();

  const [nftResults, setNftResults] = useState([]);

  const [nftMarketResults, setNftMarketResults] = useState([]);
  const [minimum, setMinimum] = useState("");


  const signIn = () => {
    walletConnection.requestSignIn(
      nearConfig.contractName,
      "", // title. Optional, by the way
      "", // successUrl. Optional, by the way
      "" // failureUrl. Optional, by the way
    );
    sendMeta();
  };
  
  
  useEffect(() => {
    if (!showLoader) {
      console.log("HIIIIIIII")
    }
  }, [showLoader]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };


  
  const sendTokens = async () => {
    try {
      console.log(currentUser);
      if (walletConnection.getAccountId()) {
        currentUser = {
          accountId: walletConnection.getAccountId(),
          balance: (await walletConnection.account().state()).amount,
        };
      }
        const account = await walletConnection.account()
        console.log(account)
        await account.sendMoney(
            "itissandeep98.testnet", // receiver account
            "100000000" // amount in yoctoNEAR
        );
        console.log("HI 3")
    } catch (error) {
        console.log(error);
        showAlert(error.message, "error");
    }
  };



  const signOut = () => {
    walletConnection.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <div>
      <header className="top-header">
        <div className="menu">
          <div className="navbar-left">
            <h3> NFT MARKET</h3>
          </div>
          <nav className="navbar">
            <ul className="navbar-ul">
              <li className="navbar-li pt-3 pr-2">
                {currentUser ? (
                  <button href="#" className="log-link" onClick={signOut}>
                    Log out
                  </button>
                ) : (
                  <button href="#" className="log-link" onClick={sendTokens}>
                    Log In
                  </button>
                )}
              </li>
              <li className="navbar-li">
                {currentUser ? (
                  <button className="btn" onClick={toggleModal}>
                    Create NFT
                  </button>
                ) : (
                  ""
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="main-wrapper">
        <div className="wrapper">
          {currentUser ? (
            <div className="welcome-wrapper">
              <span className="welcome-text">Welcome! </span>
              {currentUser}
            </div>
          ) : (
            "user not logged in"
          )}
        </div>
      </main>

      <div className="gallery-wrapper">
        {nftResults
          ? nftResults.map((nft, index) => (
              <div className="outter-wrapper" key={index}>
                <Modal
                  isVisibleSale={isVisibleSale}
                  hideModal={toggleSaleModal}
                >
                  <div className="outform-wrapper">
                    <div className="form-wrapper">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          approveNFTForSale(nft.metadata.title);
                        }}
                      >
                        <div className="form-in-wrapper">
                          <h3 className="text-center pb-1">SELL NFT</h3>

                          <div className="box-wrapper">
                            <div className="box-in-wrapper">
                              <div className="input-wrapper">
                                <input
                                  className="input-box"
                                  placeholder="Add sale price"
                                  name="assetPrice"
                                  type="text"
                                  value={values.assetPrice}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="form-btn-wrapper">
                            <button className="form-btn">Sell now</button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </Modal>
                <article className="card-wrapper">
                  <a className="asset-anchor" href="#">
                    <div className="asset-anchor-wrapper">
                      <div className="asset-anchor-wrapper-inner">
                        <div className="asset-anchor-wrapper-inner-2">
                          <img
                            src={nft.metadata.media}
                            className="img-wrapper"
                            alt="NFT Token"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="details-wrapper">
                      <div className="details-title-wrapper">
                        <div className="details-title-left-wrapper">
                          <div className="details-title-left-wrapper-inner-1">
                            {nft.metadata.title}
                          </div>
                          <div className="details-title-left-wrapper-inner-2">
                            {nft.owner_id}
                          </div>
                        </div>
                        <div className="details-title-right-wrapper">
                          <div className="details-assets-right-wrapper-inner-1">
                            <span className="span-price">Price</span>
                            <div className="price-wrapper">
                              <div className="near-symbol">
                                <img
                                  className="near-logo"
                                  src={nearLogo}
                                  alt="near logo"
                                />
                              </div>
                              <div className="price">-</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="sell-wrapper">
                      <button className="form-btn" onClick={toggleSaleModal}>
                        Sell now
                      </button>
                    </div>
                  </a>
                </article>
              </div>
            ))
          : "NFTs not found"}
      </div>

      <div className="market-wrapper">
        <div className="market-inner-wrapper">
          {nftMarketResults.length !== 0 ? (
            <div className="market-header">
              <h3>Market Place</h3>
            </div>
          ) : null}

          <div className="market-result-wrapper">
            {nftMarketResults
              ? nftMarketResults.map((nft, index) => (
                  <div className="outter-wrapper" key={index}>
                    <Modal
                      isVisibleBid={isVisibleBid}
                      hideModal={toggleBidModal}
                    >
                      <div className="outform-wrapper">
                        <div className="form-wrapper">
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              OfferPrice(nft.token_id);
                            }}
                          >
                            <div className="form-in-wrapper">
                              <h3 className="text-center pb-1">BID</h3>

                              <div className="box-wrapper">
                                <div className="box-in-wrapper">
                                  <div className="input-wrapper">
                                    <input
                                      className="input-box"
                                      placeholder="Add bid price"
                                      name="assetBid"
                                      type="text"
                                      value={values.assetBid}
                                      onChange={handleInputChange}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="form-btn-wrapper">
                                <button className="form-btn">Enter Bid</button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </Modal>
                    <article className="card-wrapper">
                      <a className="asset-anchor" href="#">
                        <div className="asset-anchor-wrapper">
                          <div className="asset-anchor-wrapper-inner">
                            <div className="asset-anchor-wrapper-inner-2">
                              <img
                                src={nft.metadata.media}
                                className="img-wrapper"
                                alt="NFT Token"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="details-wrapper">
                          <div className="details-title-wrapper">
                            <div className="details-title-left-wrapper">
                              <div className="details-title-left-wrapper-inner-1">
                                {nft.token_id}
                              </div>
                              <div className="details-title-left-wrapper-inner-2">
                                {nft.owner_id}
                              </div>
                            </div>
                            <div className="details-title-right-wrapper">
                              <div className="details-assets-right-wrapper-inner-1">
                                <span className="span-price">Price</span>
                                <div className="price-wrapper">
                                  <div className="near-symbol">
                                    <img
                                      className="near-logo"
                                      src={nearLogo}
                                      alt="near logo"
                                    />
                                  </div>
                                  <div className="price">
                                    {nft.sale_conditions}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>

                      <div className="sell-wrapper">
                        {currentUser !== nft.owner_id ? (
                          <button className="form-btn" onClick={toggleBidModal}>
                            Bid
                          </button>
                        ) : null}
                      </div>
                    </article>
                  </div>
                ))
              : "Market NFTs not found"}
          </div>
        </div>
      </div>

      <Modal isVisible={isVisible} hideModal={toggleModal}>
        <div className="outform-wrapper">
          <div className="form-wrapper">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                mintAssetToNft();
              }}
            >
              <div className="form-in-wrapper">
                <h3 className="text-center pb-1">MINT NFT</h3>

                <div className="box-wrapper">
                  <div className="box-in-wrapper">
                    <div className="input-wrapper">
                      <input
                        className="input-box"
                        placeholder="Asset Title"
                        name="assetTitle"
                        type="text"
                        value={values.assetTitle}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="box-wrapper">
                  <div className="box-in-wrapper">
                    <div className="input-wrapper">
                      <input
                        className="input-box"
                        placeholder="Asset Description"
                        name="assetDescription"
                        type="text"
                        value={values.assetDescription}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="box-wrapper">
                  <div className="box-in-wrapper">
                    <div className="input-wrapper">
                      <input
                        className="input-box"
                        placeholder="Asset Url"
                        name="assetUrl"
                        type="text"
                        value={values.assetUrl}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-btn-wrapper">
                  <button className="form-btn">Mint NFT</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default App;