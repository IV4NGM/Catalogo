class Movie{
    constructor(title, overview, score, language, release_date, imagesrc, genres){
        this.title = title
        this.overview = overview
        this.score = Math.round(score) 
        this.language = language
        this.release_date = release_date
        this.imagesrc = imagesrc
        this.genres = genres
    }
}

const apiKey = '?api_key=14c0f9442a8897b68fa2d0be6c689997'

let moviesArray = []
let moviesArrayDisplay = []

async function getApiData () {
    const response = await fetch('https://api.themoviedb.org/3/trending/movie/day' + apiKey)
    // console.log(response)
    const movies = await response.json()
    // console.log(movies.results)
    const genres = await fetch('https://api.themoviedb.org/3/genre/movie/list' + apiKey)
    // console.log(genres)
    const genresID = await genres.json()
    // console.log(genresID)
    // console.log(genresID.genres)
    let index = 0
    for(let genre of genresID.genres){
        // console.log(genre.name)
        createCheckbox(genre.name, index)
        index++
    }
    toggleAllCategories()
    // console.log(genresID.genres.filter(e => e.id == 16)[0].name)
    let languages = []
    for(let movie of movies.results){
        //poster_sizes: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original']
        const imagesrc = "https://image.tmdb.org/t/p/w300" + movie.poster_path
        let movieGenres = movie.genre_ids
        let movieGenresNameArray = []
        // let movieGenresP = `<p>`
        for(let genreNumber of movieGenres){
            // movieGenresP += `${genresID.genres.filter(e => e.id == genreNumber)[0].name} `
            movieGenresNameArray.push(genresID.genres.filter(e => e.id == genreNumber)[0].name)
        }
        if(!languages.includes(movie.original_language)){
            languages.push(movie.original_language)
        }
        // movieGenresP += '</p>'
        const currentMovie = new Movie(movie.original_title, movie.overview, movie.vote_average, movie.original_language, movie.release_date, imagesrc, movieGenresNameArray)
        moviesArray.push(currentMovie)
        // document.querySelector("#movies-container").innerHTML +=`<div><p>${currentMovie.title}</p> <p>${currentMovie.overview}</p> <p>Calificación: ${currentMovie.score}</p> <p>Idioma original: ${currentMovie.language}</p> <p>Fecha de lanzamiento: ${currentMovie.release_date}</p> ${movieGenresP} <img src=${currentMovie.imagesrc}></div>`
    }
    createLanguagesSelector(languages)
    moviesArrayDisplay = [ ...moviesArray ]
    displayMovies(moviesArrayDisplay)
    // console.log(moviesArrayDisplay)
}



function upgradeSilderData(){
    document.querySelector("#selected-score").textContent = document.querySelector("#score").value
}

function toggleAllCategories(){
    const allCategoriesCheckbox = document.querySelector("#all-categories")
    if (allCategoriesCheckbox.checked){
        document.querySelectorAll('input[type=checkbox]').forEach(element => element.disabled = true)
        allCategoriesCheckbox.disabled = false
    } else {
        allCategoriesCheckbox.checked = false
        document.querySelectorAll('input[type=checkbox]').forEach(element => element.disabled = false)
    }
}

function resetForm(){
    document.querySelector("#movie-title").textContent = ""
    document.querySelector("#all-categories").checked = true
    document.querySelector("#language").value = "0"
    document.querySelector("#score").value = 0
    toggleAllCategories()
    upgradeSilderData()
}

function applyFilters(){
    const inputTitle = document.querySelector("#movie-title").value
    const inputAllCategories = document.querySelector("#all-categories").checked
    const inputLanguage = document.querySelector("#language").value
    const inputScore = document.querySelector("#score").value
    let selectedCategories = []
    if(!inputAllCategories){
        document.querySelectorAll('input[type=checkbox]').forEach((element) =>{
            if(element.id !== "all-categories"){
                if(element.checked){
                    selectedCategories.push(element.value)
                }
            }
        })
    }
    moviesArrayDisplay = moviesArray.filter((element) =>{
        if(inputTitle !== "" && !element.title.toLocaleLowerCase().includes(inputTitle.toLocaleLowerCase().trim())){
            return false
        }
        if(inputLanguage!=="0"){
            if(inputLanguage !== element.language){
                return false
            }
        }
        if(!inputAllCategories){
            let containsAGenre = false
            for(let i = 0; i < element.genres.length; i++){
                if(selectedCategories.includes(element.genres[i])){
                    containsAGenre = true
                    break
                }
            }
            if(!containsAGenre){
                return false
            }
        }
        if(element.score < inputScore){
            return false
        }
        return true
    })
    // console.log(moviesArrayDisplay)
    displayMovies(moviesArrayDisplay)
}

function createCheckbox(value, index){
    const checkboxContainer = document.querySelector("#genre-container")
    const container = document.createElement("div")
    const input = document.createElement("input")
    const label = document.createElement("label")
    const id = "check" + index.toString()

    container.classList.add("form-check")
    input.classList.add("form-check-input")
    label.classList.add("form-check-label")

    input.setAttribute("type", "checkbox")
    input.setAttribute("value", value)
    input.setAttribute("id", id)
    label.setAttribute("for", id)

    label.textContent = value

    checkboxContainer.appendChild(container)
    container.appendChild(input)
    container.appendChild(label)
}

function createLanguagesSelector(languagesArray){
    const languageSelector = document.querySelector("#language")
    for(let language of languagesArray){
        const languageOption = document.createElement("option")
        languageOption.value = language
        languageOption.textContent = language
        languageSelector.appendChild(languageOption)
    }
}

function displayMovies(moviesToDisplay){
    const moviesContainer = document.querySelector("#movies-container")
    moviesContainer.innerHTML = ""
    if(moviesToDisplay.length == 0){
        const noMovies = document.createElement("div")
        const imageNoMovies = document.createElement("img")
        const text1 = document.createElement("p")
        const text2 = document.createElement("p")
        
        noMovies.classList.add("sorry-no-movies")
        imageNoMovies.classList.add("no-movies-img")
        imageNoMovies.alt = "No movies found"
        text1.textContent = "Ups, parece que no hay películas que coincidan con tus criterios de búsqueda."
        text2.textContent = "Intenta nuevamente con otros parámetros."

        noMovies.appendChild(imageNoMovies)
        noMovies.appendChild(text1)
        noMovies.appendChild(text2)
        moviesContainer.appendChild(noMovies)
    } else {
        moviesToDisplay.sort((a, b) =>{
            return (b.score - a.score)
        })
    }
    for(let movie of moviesToDisplay){
        const movieCard = document.createElement("div")
        const cardBody = document.createElement("div")
        const cardTitle = document.createElement("h5")
        const movieImage = document.createElement("img")
        const scoreRow = document.createElement("div")
        const scoreText =  document.createElement("p")
        const score = document.createElement("p")
        const starImage = document.createElement("img")
        const languageRow = document.createElement("div")
        const languageText =  document.createElement("p")
        const language = document.createElement("p")
        const release_dateRow = document.createElement("div")
        const release_dateText =  document.createElement("p")
        const release_date = document.createElement("p")
        const genresContainer = document.createElement("div")
        const descriptionText = document.createElement("p")
        const description = document.createElement("p")
        const playButton = document.createElement("a")

        movieCard.classList.add("card", "movie-card", "grid-item-ms")
        cardBody.classList.add("card-body", "card-body-movie")
        cardTitle.classList.add("card-title")
        movieImage.classList.add("card-img-top", "card-img-movie")
        scoreRow.classList.add("movie-row-container")
        scoreText.classList.add("card-text", "bold-text")
        score.classList.add("card-text")
        starImage.classList.add("star-image")
        languageRow.classList.add("movie-row-container")
        languageText.classList.add("card-text", "bold-text")
        language.classList.add("card-text")
        release_dateRow.classList.add("movie-row-container")
        release_dateText.classList.add("card-text", "bold-text")
        release_date.classList.add("card-text")
        genresContainer.classList.add("movie-genres-container")
        descriptionText.classList.add("action-text", "description-toggle")
        description.classList.add("card-text", "description-text")
        playButton.classList.add("btn", "btn-success", "btn-play")

        cardTitle.textContent = movie.title
        movieImage.src = movie.imagesrc
        movieImage.alt = "Poster " + movie.title
        scoreText.textContent = "Calificación:"
        score.textContent = movie.score
        languageText.textContent = "Idioma original:"
        language.textContent = movie.language
        release_dateText.textContent = "Fecha de lanzamiento:"
        release_date.textContent = movie.release_date
        for(let genre of movie.genres){
            const genreButton = document.createElement("button")
            genreButton.classList.add("btn", "btn-outline-secondary", "movie-genre")
            genreButton.textContent = genre
            genresContainer.appendChild(genreButton)
        }
        descriptionText.textContent = "Descripción"
        description.textContent = movie.overview
        playButton.innerHTML = `<span class="material-symbols-outlined">play_arrow</span> Ver ahora`

        movieCard.appendChild(cardBody)
        cardBody.appendChild(cardTitle)
        cardBody.appendChild(movieImage)
        cardBody.appendChild(scoreRow)
        scoreRow.appendChild(scoreText)
        scoreRow.appendChild(score)
        scoreRow.appendChild(starImage)
        cardBody.appendChild(languageRow)
        languageRow.appendChild(languageText)
        languageRow.appendChild(language)
        cardBody.appendChild(release_dateRow)
        release_dateRow.appendChild(release_dateText)
        release_dateRow.appendChild(release_date)
        cardBody.appendChild(genresContainer)
        cardBody.appendChild(descriptionText)
        cardBody.appendChild(description)
        cardBody.appendChild(playButton)
        moviesContainer.appendChild(movieCard)

        descriptionText.addEventListener("click", function(){
            descriptionText.classList.toggle("bold-text")
            descriptionText.classList.toggle("underlined-text")
            description.classList.toggle("show-text")
            generateMasonry()
        })
    }
    generateMasonry()
}

document.addEventListener("DOMContentLoaded", function(){
    getApiData()
    document.querySelector("#score").value = 0
    upgradeSilderData()
    document.querySelector("#score").addEventListener("input", upgradeSilderData)
    toggleAllCategories()
    document.querySelector("#all-categories").addEventListener("change", toggleAllCategories)
    document.querySelector("#reset").addEventListener("click", resetForm)
    document.querySelector("#filter-form").addEventListener("submit", function(event){
        event.preventDefault()
        applyFilters()
    })
})

function generateMasonry(){
    var elem = document.querySelector('.grid-ms');
    var msnry = new Masonry( elem, {
    // options
    itemSelector: '.grid-item-ms',
    columnWidth: 300,
    gutter: 20
    });
}

window.onload = generateMasonry