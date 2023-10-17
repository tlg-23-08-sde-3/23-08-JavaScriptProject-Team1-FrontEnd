const apiUrl =
   "https://www.themuse.com/api/public/jobs?api_key=4b6ba413bd131cdcf4ee78cb2dfef3c9419f955d73f5210df1638e20584ba25c&company=Amazon&category=Software%20Engineering&page=1&descending=true";

const jobsListContainer = document.getElementById("jobs-list-container");

async function fetchJobs() {
   const fetchedJobs = await fetch(apiUrl);
   const data = await fetchedJobs.json();
   const jobs = data.results;
   console.log(jobs);

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
}

jobsListContainer.addEventListener("click", async (e) => {
   e.preventDefault();

   const target = e.target.closest(".card");

   const fetchedJobs = await fetch(apiUrl);
   const data = await fetchedJobs.json();
   const jobs = data.results;
   console.log(jobs);

   const job = jobs.find((job) => {
      console.log(job.id, target.id);
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
