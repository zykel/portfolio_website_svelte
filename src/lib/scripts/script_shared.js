import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// To open and close the hamburger menu
document.querySelectorAll('.func-toggle-menu').forEach(node => node.addEventListener('click', toggleMenu));

function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Add play/pause buttons for videos
const playSVGs = d3.selectAll('.play-button-svg');

playSVGs.append('path')
    .attr('class', 'video-btn-frame-path')
    .attr('d', 'M 19.355326,4.9999998 H 80.644673 C 88.597525,4.9999998 95,11.402475 95,19.355326 V 80.644673 C 95,88.597525 88.597525,95 80.644673,95 H 19.355326 C 11.402475,95 5,88.597525 5,80.644673 V 19.355326 C 5,11.402475 11.402475,4.9999998 19.355326,4.9999998 Z');

playSVGs.append('path')
    .attr('class', 'video-btn-play-path')
    .attr('d', 'm 39.86167,49.999611 c 0,0 0,-22.734135 0,-22.734135 0,0 29.949322,22.734821 29.949322,22.734821 0,0 -29.949322,22.733448 -29.949322,22.733448 0,0 0,-22.734134 0,-22.734134 z');

const pauseGs = playSVGs.append('g')
    .attr('class', 'video-btn-pause-path-g')
    .style('display', 'none');

pauseGs.append('path')
    .attr('class', 'video-btn-pause-path')
    .attr('d', 'm 38.80331,27.265484 c 0,0 0,45.468274 0,45.468274');

pauseGs.append('path')
    .attr('class', 'video-btn-pause-path')
    .attr('d', 'm 61.196734,27.265486 c 0,0 0,45.46827 0,45.46827');


// Project teaser video animation playback
function findAncestor (node, classSearched) {
  while ((node = node.parentElement) && !node.classList.contains(classSearched));
  return node;
}

d3.selectAll('.teaser-video')
    .on('mouseenter', (event, d) => {
        // If the video is also a project image on the main page, underline the corresponding project title
        // const projectImgMaybe = d3.select(event.target);
        // if (projectImgMaybe.classed('project-img')) {
        //     const videoId = projectImgMaybe.attr('data-video-id');
        // Whould need to give that data value to the project title again if I want to make that work
        //     d3.select(`.project-title[data-video-id="${videoId}"]`).style('text-decoration', 'underline');
        // }

        // Play the video
        event.target.play();
        // Find the play/pause buttons and toggle them
        // Get the video id
        const videoId = event.target.getAttribute('data-video-id');
        // Find the symbols
        const playSymbol = document.querySelector(`.play-button-svg[data-video-id="${videoId}"] > .video-btn-play-path`);
        const pauseSymbol = document.querySelector(`.play-button-svg[data-video-id="${videoId}"] > .video-btn-pause-path-g`);
        // Toggle the symbols (if they exist)
        if (playSymbol && pauseSymbol) {
          playSymbol.style.display = 'none';
          pauseSymbol.style.display = 'block';
        } else {
            console.warn(`Could not find playSymbol and/or pauseSymbol for videoId ${videoId}`);
        }
      })
    .on('mouseleave', (event, d) => {
        // If the video is also a project image on the main page, underline the corresponding project title
        // const projectImgMaybe = d3.select(event.target);
        // if (projectImgMaybe.classed('project-img')) {
        //     const videoId = projectImgMaybe.attr('data-video-id');
        //     d3.select(`.project-title[data-video-id="${videoId}"]`).style('text-decoration', '');
        // }

        // Pause the video
        event.target.pause();
        // Find the play/pause buttons and toggle them
        // Get the video id
        const videoId = event.target.getAttribute('data-video-id');
        // Find the symbols
        const playSymbol = document.querySelector(`.play-button-svg[data-video-id="${videoId}"] > .video-btn-play-path`);
        const pauseSymbol = document.querySelector(`.play-button-svg[data-video-id="${videoId}"] > .video-btn-pause-path-g`);
        // Toggle the symbols (if they exist)
        if (playSymbol && pauseSymbol) {
          playSymbol.style.display = 'block';
          pauseSymbol.style.display = 'none';
        } else {
            console.warn(`Could not find playSymbol and/or pauseSymbol for videoId ${videoId}`);
        }
      });

playSVGs.on('click', (event, d) => {
    // Toggle the video playback and the playback symbols 
    // Get the SVG element
    const svgElement = event.target.ownerSVGElement || event.target;
    // Get the video id
    const videoId = svgElement.getAttribute('data-video-id');

    // Find the video
    const video = document.querySelector(`.teaser-video[data-video-id="${videoId}"]`);
    // Toggle the video playback
    if (video.paused) {
        // Ensure that no two videos are running at the same time
        // Pause all videos
        document.querySelectorAll('.teaser-video').forEach(video => video.pause());
        // Find all symbols
        const playSymbols = document.querySelectorAll(`.video-btn-play-path`);
        const pauseSymbols = document.querySelectorAll(`.video-btn-pause-path-g`);
        // Set all symbols to reflect that the video is not playing
        playSymbols.forEach(playSymbol => playSymbol.style.display = 'block');
        pauseSymbols.forEach(pauseSymbol => pauseSymbol.style.display = 'none');

        // Play the actual video
        video.play();
    } else {
        video.pause();
    }

    // Find the symbols
    const playSymbol = svgElement.querySelector(`.video-btn-play-path`);
    const pauseSymbol = svgElement.querySelector(`.video-btn-pause-path-g`);
    // Toggle the symbols
    playSymbol.style.display = video.paused ? 'block' : 'none';
    pauseSymbol.style.display = video.paused ? 'none' : 'block';
})