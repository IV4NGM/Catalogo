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
    // console.log(genresID.genres)
    let index = 0
    for(let genre of genresID.genres){
        // console.log(genre.name)
        createCheckbox(genre.name, index)
        index++
    }
    toggleAllCategories()
    // console.log(genresID.genres.filter(e => e.id == 16)[0].name)
    for(let movie of movies.results){
        //poster_sizes: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original']
        const imagesrc = "https://image.tmdb.org/t/p/w300" + movie.poster_path
        let movieGenres = movie.genre_ids
        let movieGenresNameArray = []
        let movieGenresP = `<p>`
        for(let genreNumber of movieGenres){
            movieGenresP += `${genresID.genres.filter(e => e.id == genreNumber)[0].name} `
            movieGenresNameArray.push(genresID.genres.filter(e => e.id == genreNumber)[0].name)
        }
        movieGenresP += '</p>'
        const currentMovie = new Movie(movie.original_title, movie.overview, movie.vote_average, movie.original_language, movie.release_date, imagesrc, movieGenresNameArray)
        moviesArray.push(currentMovie)
        document.querySelector("#container").innerHTML +=`<div><p>${currentMovie.title}</p> <p>${currentMovie.overview}</p> <p>Calificación: ${currentMovie.score}</p> <p>Idioma original: ${currentMovie.language}</p> <p>Fecha de lanzamiento: ${currentMovie.release_date}</p> ${movieGenresP} <img src=${currentMovie.imagesrc}></div>`
    }
    moviesArrayDisplay = [ ...moviesArray ]
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
    console.log(moviesArrayDisplay)
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