var apiKey = config.key;
var url = "", id = "", memberUrl = "";

$(document).ready(function() {
  fetchRecentBills($(".congress-number").val());
});

$(document).on('click', '.sponsor', function() {
  id = $(this).attr('data-sponsorId');
  $('.overlay-container').empty();
  $('.overlay').addClass('active');
  fetchMemberInfo(id);
});

$(".close-overlay").click(function() {
  $(".overlay").removeClass("active");  
});

$(".congress-number").change(function() {
  $(".bills-container").empty();
  fetchRecentBills($(this).val());
});

function fetchRecentBills(congressNumber) {
  superagent
    .get(
      `https://api.propublica.org/congress/v1/${congressNumber}/house/bills/introduced.json`
    )
    .set("X-API-Key", apiKey)
    .then(function(response) {
      console.log(response);
      renderBills(response.body.results[0].bills);
    });
}

function renderBills(bills) {
  bills.forEach(function(bill) {
    $(".bills-container").append(`
      <div class="bill">
        <h2>${bill.title}</h2>
        <h3>Sponsored by 
        ${bill.sponsor_title} 
        <span class="sponsor" data-sponsorId="${bill.sponsor_id}">${bill.sponsor_name}</span>
        (${bill.sponsor_party} - ${bill.sponsor_state})</h3>
        <p>${bill.summary}</h2>
      </div>
    `);
  });
}

function fetchMemberInfo(id) {
  // http request format
  // GET https://api.propublica.org/congress/v1/members/{member-id}.json
  url = `https://api.propublica.org/congress/v1/members/${id}.json`;
  superagent
    .get(url)
    .set("X-API-Key", apiKey)
    .then(function(res) {
      console.log(res);
      renderInfo(res);
  });
}

function renderInfo(res) {
  if (res.body.results[0].url == null) {
    memberUrl = "Not Available";
  } else {
    memberUrl = res.body.results[0].url;
  }
  $('.overlay-container').append(`
    <table class="info">
      <tr><td>FIRST NAME</td><td>${res.body.results[0].first_name}</td></tr>
      <tr><td>LAST NAME</td><td>${res.body.results[0].last_name}</td></tr>
      <tr><td>MEMBER ID</td><td>${res.body.results[0].member_id}</td></tr>
      <tr><td>URL</td><td>${memberUrl}</td></tr>
      <tr><td>DATE OF BIRTH</td><td>${res.body.results[0].date_of_birth}</td></tr>
      <tr><td>CURRENT PARTY</td><td>${res.body.results[0].current_party}</td></tr>
    </table>
  `);
}
