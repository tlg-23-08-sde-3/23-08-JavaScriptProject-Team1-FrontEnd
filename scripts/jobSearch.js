export const jobSearch = async () => {
   const jobsListContainer = document.getElementById("jobs-list-container");
   console.log("triggwered");

   async function displayFirstJobDetails(id) {
      const fetchedJobs = await fetch("http://localhost:3000/job");
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
    <button class="btn btn-primary" onclick="window.open('https://www.google.com', '_blank')">Apply</button> 
 
    `;
      jobViewContainer.innerHTML = "";
      jobViewContainer.appendChild(singleJobView);
   }

   const jobRoleInput = document.getElementById("role-search-input").value;
   const locationInput = document.getElementById("location-search-input").value;
   const keywordsInput = document.getElementById("keywords-search-input").value;

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

   //create query string using JS API
   const queryString = new URLSearchParams(query).toString();

   const fetchedJobs = await fetch(
      "http://localhost:3000/job" + `?${queryString}`
   );
   const jobs = await fetchedJobs.json();
   console.log(jobs);

   jobsListContainer.innerHTML = "";
   document.querySelector(".pagination").innerHTML = ""; // clearing pagination navbar

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
      const favLink = document.createElement("a");
      favLink.id = `fav-jobId-${job._id}`;
      const favImg = document.createElement("img");
      favImg.src = "star.png";
      favImg.style = "width: 20px; height: 20px";
      favLink.append(favImg);

      const slicedJobDescription = job.contents.slice(0, 200);
      cardText.innerHTML = `
         
         <p><b>Salary: </b>${job.pay}</p>
         <p><b>Location:</b> ${job.location}</p>
         <p><b>Job Description: </b>${slicedJobDescription}</p>
      `;

      cardDiv.innerHTML = `
      <div class="card-body">
      <h5 class="card-title">${job.name}</h5>
    </div>
      `;
      cardDiv.querySelector(".card-body").appendChild(cardText);
      cardDiv.querySelector(".card-body").appendChild(favLink);

      jobsListContainer.appendChild(cardDiv);
   });

   //----------------------------------------------pagination handling------------------------------
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
};
