const apiUrl =
   "https://www.themuse.com/api/public/jobs?api_key=4b6ba413bd131cdcf4ee78cb2dfef3c9419f955d73f5210df1638e20584ba25c&company=Amazon&category=Software%20Engineering&page=1&descending=true";

fetch(apiUrl)
   .then((response) => response.json())
   .then((data) => {
      console.log(data.results[0]);
   })
   .catch((error) => {
      console.error("Error fetching data:", error);
   });
