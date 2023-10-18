const apiUrl =
   "https://www.themuse.com/api/public/jobs?api_key=4b6ba413bd131cdcf4ee78cb2dfef3c9419f955d73f5210df1638e20584ba25c&company=Amazon&category=Software%20Engineering&page=1&descending=true";

const jobsListContainer = document.getElementById("jobs-list-container");

async function fetchJobs() {
   const fetchedJobs = await fetch(apiUrl);
   const data = await fetchedJobs.json();
   const jobs = data.results;
   


   jobs.forEach((job) => {
      const cardDiv = Object.assign(document.createElement("div"), {
         classList: "card",
         style: "width: 50rem",
         id: job.id,
      });

      cardDiv.dataset.jobID = job.id;

      // trimmed description p element
      const cardText = document.createElement("p");
      cardText.classList.add("card-text");

      const slicedJobDescription = job.contents.slice(0, 200);
      cardText.innerHTML = slicedJobDescription;

      cardDiv.innerHTML = `
      <div class="card-body">
      <h5 class="card-title">${job.name}</h5>
    </div>
      `;
      cardDiv.querySelector(".card-body").appendChild(cardText);

      jobsListContainer.appendChild(cardDiv);
   });

   //pagination handling
   const itemsPerPage = 5;

   let currentPage = 1;

   // jobs on current page
   async function showPage(page) {
      const jobCards = $(".card");

      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;

      jobCards.hide();
      jobCards.slice(start, end).show();
      // calling function to display first job

      await displayFirstJobDetails(jobCards.slice(start, end)[0].id);
      // add "active" class for highlight color"
   }

   showPage(currentPage);

   // Handle pagination click events
   $(".pagination").on("click", "a.page-link", function (e) {
      e.preventDefault();
      const text = $(this).text();
      if (text === "Previous") {
         if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
         }
      } else if (text === "Next") {
         if (currentPage < Math.ceil($(".card").length / itemsPerPage)) {
            currentPage++;
            showPage(currentPage);
         }
      } else {
         currentPage = parseInt(text);
         showPage(currentPage);
      }

      // check for active number, remove active class and add for current page number
      const pageItems = document.querySelectorAll(".pagination .page-item");

      pageItems.forEach((pageItem) => {
         pageItem.classList.remove("active");
      });

      const secondPageItem = document.querySelector(
         `.pagination .page-item:nth-child(${currentPage + 1})`
      );

      secondPageItem.classList.add("active");
   });
}

// display first job on page in details on right
async function displayFirstJobDetails(id) {
   const fetchedJobs = await fetch(apiUrl);
   const data = await fetchedJobs.json();
   const jobs = data.results;


   const job = jobs.find((job) => {
      
      return job.id === Number(id);
   });

   const jobViewContainer = document.getElementById("jobs-view-conainer");

   const singleJobView = Object.assign(document.createElement("div"), {
      classList: "card",
      style: "width: 50rem",
   });

   singleJobView.innerHTML = `
   <h5>${job.name}</h5>
   <p>${job.contents}</p>
   <button type="button" class="btn btn-primary" onclick="window.location.href='${job.refs.landing_page}'" target="_blank" rel="noopener noreferrer">Apply</button>

   `;
   jobViewContainer.innerHTML = "";
   jobViewContainer.appendChild(singleJobView);
}

jobsListContainer.addEventListener("click", async (e) => {
   e.preventDefault();

   const target = e.target.closest(".card");

   const fetchedJobs = await fetch(apiUrl);
   const data = await fetchedJobs.json();
   const jobs = data.results;
   

   const job = jobs.find((job) => {
      
      return job.id === Number(target.id);
   });

   const jobViewContainer = document.getElementById("jobs-view-conainer");

   const singleJobView = Object.assign(document.createElement("div"), {
      classList: "card",
      style: "width: 50rem",
   });

   singleJobView.innerHTML = `
   <h5>${job.name}</h5>
   <p>${job.contents}</p>
   <button type="button" class="btn btn-primary" onclick="window.location.href='${job.refs.landing_page}'" target="_blank" rel="noopener noreferrer">Apply</button>

   `;
   jobViewContainer.innerHTML = "";
   jobViewContainer.appendChild(singleJobView);
});

fetchJobs();
