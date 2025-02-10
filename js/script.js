$(document).ready(function () {
   const apiUrl = "https://api.brawlify.com/v1/brawlers";
   let allBrawlers = [];
   let displayedCount = 0;
   const batchSize = 12;

   function showSkeletonLoader() {
      let skeletonHTML = "";
      for (let i = 0; i < batchSize; i++) {
         skeletonHTML += `
             <div class="col-md-3">
                 <div class="card mb-3">
                     <div class="skeleton skeleton-img"></div>
                     <div class="card-body text-center">
                         <div class="skeleton skeleton-text"></div>
                         <div class="skeleton skeleton-button"></div>
                     </div>
                 </div>
             </div>`;
      }
      $("#brawler-list").html(skeletonHTML);
   }

   function renderBrawlers(filterRarity, searchQuery, append = false) {
      let brawlerList = $("#brawler-list");
      if (!append) brawlerList.empty();

      let filteredBrawlers = allBrawlers.filter((brawler) => {
         let brawlerName = brawler.name.toLowerCase();
         let brawlerRarity = brawler.rarity.name.toLowerCase();
         let matchRarity =
            filterRarity === "all" || brawlerRarity === filterRarity;
         let matchSearch = brawlerName.includes(searchQuery);
         return matchRarity && matchSearch;
      });

      let brawlersToShow = filteredBrawlers.slice(
         displayedCount,
         displayedCount + batchSize
      );

      brawlersToShow.forEach((brawler) => {
         let brawlerCard = `
             <div class="col-md-2 fade-in">
                 <div class="card mb-3">
                     <img src="${brawler.imageUrl}" class="card-img-top">
                     <div class="card-body text-center">
                         <h5 class="card-title mb-3">${brawler.name}</h5>
                         <button class="btn btn-primary btn-detail" data-id="${brawler.id}">Detail</button>
                     </div>
                 </div>
             </div>`;
         brawlerList.append(brawlerCard);
      });

      displayedCount += batchSize;

      if (displayedCount >= filteredBrawlers.length) {
         $("#load-more").hide();
      } else {
         $("#load-more").show();
      }
   }

   showSkeletonLoader();
   $.getJSON(apiUrl, function (data) {
      allBrawlers = data.list.sort((a, b) => a.id - b.id);
      displayedCount = 0;
      renderBrawlers("all", "");
   });

   $("#search").on("keyup", function () {
      let searchQuery = $(this).val().toLowerCase();
      let selectedRarity = $(".dropdown-item.active").data("rarity") || "all";
      displayedCount = 0;
      renderBrawlers(selectedRarity, searchQuery);
   });

   $(".rarity-option").on("click", function (e) {
      e.preventDefault();
      let selectedRarity = $(this).data("rarity");

      $("#rarityDropdown").text($(this).text());
      $(".rarity-option").removeClass("active");
      $(this).addClass("active");

      let searchQuery = $("#search").val().toLowerCase();
      displayedCount = 0;
      renderBrawlers(selectedRarity, searchQuery);
   });

   $("#load-more").on("click", function () {
      let searchQuery = $("#search").val().toLowerCase();
      let selectedRarity = $(".dropdown-item.active").data("rarity") || "all";
      renderBrawlers(selectedRarity, searchQuery, true);
   });

   $(document).on("click", ".btn-detail", function () {
      let brawlerId = $(this).data("id");
      let brawler = allBrawlers.find((b) => b.id === brawlerId);

      if (brawler) {
         $("#brawlerModalLabel").text(brawler.name);
         $("#brawlerImage").attr("src", brawler.imageUrl);
         $("#brawlerDescription").text(
            brawler.description || "Tidak ada deskripsi."
         );
         $("#brawlerRarity").text(brawler.rarity.name);
         $("#brawlerClass").text(brawler.class.name);

         if (brawler.starPowers.length > 0) {
            $("#spBrawler1").text(brawler.starPowers[0].name);
            $("#spBrawler1gmbr").attr("src", brawler.starPowers[0].imageUrl);
            $("#spBrawler1desc").text(brawler.starPowers[0].description);
         }

         if (brawler.starPowers.length > 1) {
            $("#spBrawler2").text(brawler.starPowers[1].name);
            $("#spBrawler2gmbr").attr("src", brawler.starPowers[1].imageUrl);
            $("#spBrawler2desc").text(brawler.starPowers[1].description);
         }

         if (brawler.gadgets.length > 0) {
            $("#gadgetBrawler1").text(brawler.gadgets[0].name);
            $("#gadgetBrawler1gmbr").attr("src", brawler.gadgets[0].imageUrl);
            $("#gadgetBrawler1desc").text(brawler.gadgets[0].description);
         }

         if (brawler.gadgets.length > 1) {
            $("#gadgetBrawler2").text(brawler.gadgets[1].name);
            $("#gadgetBrawler2gmbr").attr("src", brawler.gadgets[1].imageUrl);
            $("#gadgetBrawler2desc").text(brawler.gadgets[1].description);
         }

         $("#brawlerModal").modal("show");
      }
   });

   $(window).scroll(function () {
      if ($(this).scrollTop() > 300) {
         $("#back-to-top").fadeIn();
      } else {
         $("#back-to-top").fadeOut();
      }
   });

   $("#back-to-top").click(function () {
      $("html, body").animate({ scrollTop: 0 }, 500);
   });
});
