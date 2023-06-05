import axios from "axios";
import * as $ from "jquery";

const $showsList = $("#showsList");
const $episodesList = $("#episodesList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

const BASE_URL = "https://api.tvmaze.com/";
const DEFAULT_IMG =
  "https://tinyurl.com/tv-missing";

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

interface ShowInterfaceFromAPI {
  id: number;
  name: string;
  summary: string;
  image: { medium: string } | null;
};

interface ShowInterface {
  id: number,
  name: string,
  summary: string,
  image: string,
};

async function getShowsByTerm(term: string): Promise<ShowInterface[]> {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const resp = await axios.get(`${BASE_URL}search/shows?q=${term}`);

  return resp.data.map((result: { show: ShowInterfaceFromAPI }): ShowInterface => {
    const show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image?.medium || DEFAULT_IMG,
    };
  });
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows: ShowInterface[]) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val() as string;
  const shows = await getShowsByTerm(term)

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// interface EpisodeInterfaceFromAPI {
//   id: number;
//   name: string;
//   summary: string;
//   image: { medium: string } | null;
// };

interface EpisodeInterface {
  id: number,
  name: string,
  season: string,
  number: string,
};

async function getEpisodesOfShow(id: number): Promise<EpisodeInterface[]> {
  const resp = await axios.get(`${BASE_URL}shows/${id}/episodes`)
  return resp.data.map((result:  EpisodeInterface ): EpisodeInterface => {
    return {
      id: result.id,
      name: result.name,
      season: result.season,
      number: result.number
    };
  });
 }


/** Given list of episodes, create markup for each and append to DOM */

function populateEpisodes(episodes: EpisodeInterface[]) {
  $episodesArea.empty();

  for (let episode of episodes) {
    const $episode = $(
      `<li id=${episode.id}>${episode.name} (season ${episode.season}, number ${episode.number})</li>
      `
    );

    $episodesList.append($episode);
  }
  $episodesArea.show();
}

/** Handle button click: get episodes from API and display.
 */

async function getAndShowEpisodes() {

  const episodes = getEpisodesOfShow(id)
  populateEpisodes(episodes)

}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});
