const fetchJobs = () => {
  axios
    .get(
      "https://script.googleusercontent.com/macros/echo?user_content_key=FtE6zRykO94owqXFyX7Yok3Rc-YtMxxE3tfjDxtG20DKVE_z3bE4b5Wi4sRKOX8VU38M92OERaG4ZQI4Z4JT6FU_8FBUUypFm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnDbR9y8FUVF5giZftNBgRXSF3JA3xTNlXOvMtkV2x58UaDy-TPly4pXw33BN2fIJv-IqWsDnSrEd&lib=Ms2LuzkoTWjLpm0UGqmQnpfkSPZuzewKU"
    )
    .then(response => {
      const jobs = response.data;

      updateDOM(jobs);
    })
    .catch(error => console.error(error));
};

const updateDOM = jobs => {
  const vagas = document.querySelector("#vagas");
  let jobsElement = "";
  //iterate over all users
  jobs.job.map(job => {
    console.log(job.description);
    if (job.status === "ABERTA" && job.description === "") {
      const element = `<div class="row card-vaga" style="margin-top: 30px;">
        <div class="col" style="padding: 20px">
            <div style="margin-bottom: 10px;">
                <span class="name-vaga">${job.title}</span>
                <small class="tag">Horário flexível</small>
                <small class="tag">${
                  job.location ? job.location : "Remoto"
                }</small>
                <small class="tag">PJ</small>
            </div>
            <span class="depo">
               ${job.description}
            </span>
            <div style="margin-top: 10px">
                <button type="button" id="${
                  job.id
                }" class="btn btn-success btn-sm hvr-grow"
                onclick="loginLinkedin('${job.id}', '${job.title}')"
                >SE CANDIDATAR NA
                    VAGA!</button>
            </div>
        </div>
    </div>`;

      jobsElement = jobsElement + " " + element;
    }
  });

  vagas.innerHTML = jobsElement;
};

loginLinkedin = (oportunityId = "", oportunityTitle = "") => {
  localStorage.linkedInReactLoginRedirectUri = window.location.href;
  localStorage.oportunityId = oportunityId;
  localStorage.oportunityTitle = oportunityTitle;
  const redirectUri = encodeURIComponent(window.location.href);

  axios
    .post("http://localhost:3456/login-linkedin", { redirectUri })
    .then(response => {
      const { url } = response.data;
      window.location.href = url;
    })
    .catch(error => console.error(error));
};

requestAcessTokenLinkedin = () => {
  addEventClickImg();
  const redirectUri = `${localStorage.linkedInReactLoginRedirectUri}success`;
  const code = getQueryParameter("code");
  const oportunityId = localStorage.oportunityId;
  const oportunityTitle = localStorage.oportunityTitle;

  axios
    .post("http://localhost:3456/connectME-linkedin", {
      redirectUri,
      code,
      oportunityId,
      oportunityTitle
    })
    .then(response => {
      localStorage.removeItem("oportunityId");
      localStorage.removeItem("oportunityTitle");
    })
    .catch(error => console.error(error));
};

getQueryParameter = name => {
  const match = RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, " "));
};

redirectHome = () => {
  window.location.href = localStorage.linkedInReactLoginRedirectUri;
};

addEventClickImg = () => {
  let imgTag = document.getElementById("eznetworkimg");

  imgTag.addEventListener("click", function() {
    redirectHome();
  });
};
