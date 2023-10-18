// const apiUrl =
//    "https://www.themuse.com/api/public/jobs?api_key=4b6ba413bd131cdcf4ee78cb2dfef3c9419f955d73f5210df1638e20584ba25c&company=Amazon&category=Software%20Engineering&page=1&descending=true";

const apiUrl = "http://localhost:3000/job";

const jobsListContainer = document.getElementById("jobs-list-container");

async function fetchJobs() {
   const fetchedJobs = await fetch(apiUrl);
   const jobs = await fetchedJobs.json();
   console.log(jobs);

   jobs.forEach((job) => {
      const cardDiv = Object.assign(document.createElement("div"), {
         classList: "card",
         style: "width: 50rem",
         id: job._id,
      });

      cardDiv.dataset.jobID = job.id;

      // trimmed description p element
      const cardText = document.createElement("p");
      cardText.classList.add("card-text");

      const slicedJobDescription = job.contents.slice(0, 200);
      cardText.innerHTML = `
         
         <p>${job.pay}</p>
         <p>${job.location}</p>
         ${slicedJobDescription}
      `;

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

   // Calculate the number of total pages based on the number of jobs
   const totalPages = Math.ceil(jobs.length / itemsPerPage);

   // Create the pagination links dynamically
   for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement("li");
      pageLink.classList.add("page-item");
      pageLink.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      document.querySelector(".pagination").appendChild(pageLink);

      if (i === 1) {
         pageLink.classList.add("active");
      }
   }

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
         `.pagination .page-item:nth-child(${currentPage})`
      );

      secondPageItem.classList.add("active");
   });
}

// display first job on page in details on right
async function displayFirstJobDetails(id) {
   const fetchedJobs = await fetch(apiUrl);
   const jobs = await fetchedJobs.json();

   // const jobs = data.results;

   const job = jobs.find((job) => {
      return job._id.trim() === id.trim(); // white space though length same
   });

   const jobViewContainer = document.getElementById("jobs-view-conainer");

   const singleJobView = Object.assign(document.createElement("div"), {
      classList: "card",
      style: "width: 50rem",
   });

   singleJobView.innerHTML = `
   <h5>${job.name}</h5>
   <p>${job.contents}</p>
   <button type="button" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Apply</button> 

   `;
   jobViewContainer.innerHTML = "";
   jobViewContainer.appendChild(singleJobView);
}

jobsListContainer.addEventListener("click", async (e) => {
   e.preventDefault();

   const target = e.target.closest(".card");

   const fetchedJobs = await fetch(apiUrl);
   const jobs = await fetchedJobs.json();
   // const jobs = data.results;

   const job = jobs.find((job) => {
      return job._id.trim() === target.id.trim();
   });

   const jobViewContainer = document.getElementById("jobs-view-conainer");

   const singleJobView = Object.assign(document.createElement("div"), {
      classList: "card",
      style: "width: 50rem",
   });

   singleJobView.innerHTML = `
   <h5>${job.name}</h5>
   <p>${job.contents}</p>
   <button type="button" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Apply</button>

   `;
   jobViewContainer.innerHTML = "";
   jobViewContainer.appendChild(singleJobView);
});

document
   .getElementById("search-jobs-form")
   .addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("triggwered");

      const jobRoleInput = document.getElementById("role-search-input").value;
      const locationInput = document.getElementById(
         "location-search-input"
      ).value;
      const keywordsInput = document.getElementById(
         "keywords-search-input"
      ).value;

      console.log(jobRoleInput, locationInput);

      const query = {};

      if (jobRoleInput) {
         query.name = jobRoleInput;
      }

      if (locationInput) {
         query.location = locationInput;
      }

      if (keywordsInput) {
         query.keywords = keywordsInput;
      }

      //create query string
      const queryString = new URLSearchParams(query).toString();

      console.log(apiUrl + `?${queryString}`);

      const fetchedJobs = await fetch(apiUrl + `?${queryString}`);
      const jobs = await fetchedJobs.json();
      console.log(jobs);

      jobsListContainer.innerHTML = "";
      document.querySelector(".pagination").innerHTML = "";

      jobs.forEach((job) => {
         const cardDiv = Object.assign(document.createElement("div"), {
            classList: "card",
            style: "width: 50rem",
            id: job._id,
         });

         cardDiv.dataset.jobID = job.id;

         // trimmed description p element
         const cardText = document.createElement("p");
         cardText.classList.add("card-text");

         const slicedJobDescription = job.contents.slice(0, 200);
         cardText.innerHTML = `
            
            <p>${job.pay}</p>
            <p>${job.location}</p>
            ${slicedJobDescription}
         `;

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

      // Calculate the number of total pages based on the number of jobs
      const totalPages = Math.ceil(jobs.length / itemsPerPage);

      // Create the pagination links dynamically
      for (let i = 1; i <= totalPages; i++) {
         const pageLink = document.createElement("li");
         pageLink.classList.add("page-item");
         pageLink.innerHTML = `<a class="page-link" href="#">${i}</a>`;
         document.querySelector(".pagination").appendChild(pageLink);

         if (i === 1) {
            pageLink.classList.add("active");
         }
      }

      // jobs on current page
      async function showPage(page) {
         const jobCards = $(".card");
         console.log(jobCards);

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
            `.pagination .page-item:nth-child(${currentPage})`
         );

         secondPageItem.classList.add("active");
      });

      document.getElementById("role-search-input").value = "";
      document.getElementById("location-search-input").value = "";
      document.getElementById("keywords-search-input").value = "";
   });

fetchJobs();
