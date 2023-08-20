  //Send referral ID to server via AJAX
  function sendReferralId(referralId) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/referral");
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({ referralId }));
  }

  // Call sendReferralId function with referral ID from Rewardful
  Rewardful.ready(() => {
    sendReferralId(Rewardful.referral);
  });
