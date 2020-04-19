addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond randomly with either a win or a lose page.
 * @param {Request} request
 */
async function handleRequest(request) {
// fetch page links
  let response = await fetch('https://cfw-takehome.developers.workers.dev/api/variants')
  if (!response.ok) {
    console.log("Oh no! Something is wrong: " + response.status)
  }
  let responseJSON = await response.json()

// attempt to grab coin flip cookie
// if user has made a request in the past, set coinflip to the same page. otherwise, toss a new coin
  let coinFlip = getCoinFlip(request)
  coinFlip = coinFlip ? coinFlip : Math.round(Math.random())

  if (coinFlip == 1) {
    let webpage = await fetch(responseJSON['variants'][1])
    transformed = new HTMLRewriter().on('*', new ElementHandler1()).transform(webpage)
    transformed.headers.set('Set-Cookie', 'coinFlip=1; max-age=3600')
    return transformed
  } else {
    let webpage = await fetch(responseJSON['variants'][0])
    transformed = new HTMLRewriter().on('*', new ElementHandler2()).transform(webpage)
    transformed.headers.set('Set-Cookie', 'coinFlip=2; max-age=3600')
    return transformed
  }
}

/**
 * Search for and grab coin flip cookie. If not found, return null.
 * @param {Request} request
 */
function getCoinFlip(request) {
  let cookieString = request.headers.get('cookie')
  if (cookieString) {
    let cookieList = cookieString.split(';')
    for (let cookie of cookieList) {
      let cookieSplit = cookie.split('=')
      if (cookieSplit[0].trim() == 'coinFlip') {
        return cookieSplit[1].trim()
      }
    }
  }
  return null
}

/**
 * Element handler for winner's page
 */
class ElementHandler1 {
  element(element) {
    if (element.tagName == 'title') {
      element.setInnerContent('Congratulations!')
    }
    if (element.tagName == 'h1' && element.getAttribute('id') == 'title') {
      element.setInnerContent('You WIN!')
    }
    if (element.tagName == 'p' && element.getAttribute('id') == 'description') {
      element.setInnerContent('Congratulations! Here, check out this funny animals video!')
    }
    if (element.tagName == 'a' && element.getAttribute('id') == 'url') {
      element.setAttribute('href', 'https://www.youtube.com/watch?v=VB4CCHHYOqY')
      element.setInnerContent('Funny Video')
    }
    if (element.getAttribute('class') == 'mt-5 sm:mt-6') {
      let new_button = "<div class='mt-5 sm:mt-6' style='margin-top: 10px;'>" +
                        "<span class='flex w-full rounded-md shadow-sm'>" +
                          "<a class='inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-blue-500 text-base leading-6 font-medium text-white shadow-sm hover:bg-blue-400 focus:outline-none focus:border-blue-500 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5'" +
                          "href='' id='coin-flip-change'>Visit the loser page</a></span></div>"
      element.after(new_button, { html: true })
    }
    if (element.tagName == 'body') {
      let addButtonListener = "<script>document.getElementById('coin-flip-change').addEventListener('click', function(){ document.cookie = 'coinFlip=2; max-age=3600' }) </script>"
      element.append(addButtonListener, { html: true })
    }
  }
}

/**
 * Element handler for loser's page
 */
class ElementHandler2 {
  element(element) {
    if (element.tagName == 'title') {
      element.setInnerContent(":(")
    }
    if (element.tagName == 'h1' && element.getAttribute('id') == 'title'){
      element.setInnerContent("You lose :(")
    }
    if (element.tagName == 'p' && element.getAttribute('id') == 'description') {
      element.setInnerContent('Oh no... you will have to settle for my personal website...')
    }
    if (element.tagName == 'a' && element.getAttribute('id') == 'url') {
      element.setAttribute('href', 'https://jerry-jiao.github.io')
      element.setInnerContent("Jerry's personal website")
    }
    if (element.getAttribute('class') == 'mt-5 sm:mt-6') {
      let new_button = "<div class='mt-5 sm:mt-6' style='margin-top: 10px;'>" +
                        "<span class='flex w-full rounded-md shadow-sm'>" +
                          "<a class='inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-blue-500 text-base leading-6 font-medium text-white shadow-sm hover:bg-blue-400 focus:outline-none focus:border-blue-500 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5'" +
                          "href='' id='coin-flip-change'>Visit the winner page</a></span></div>"
      element.after(new_button, { html: true })
    }
    if (element.tagName == 'body') {
      let addButtonListener = "<script>document.getElementById('coin-flip-change').addEventListener('click', function(){ document.cookie = 'coinFlip=1; max-age=3600' }) </script>"
      element.append(addButtonListener, { html: true })
    }
  }
}
