function isActiveRoute(route, currentRoute){
    return route === currentRoute ? 'active' : '';
}

// Helper function for calculating reading time of blog post
const readingTime = (post) => {
    // get number of words in blogpost
    const wordCount = post.split(' ').length
    // get the number of words per minute
    // assuming an average person reads 200 words per minute
    const countPerMinute = wordCount / 200
    const readingTime = Math.ceil(countPerMinute)
    return ` ${readingTime} Minute Read Time`  
}

module.exports = {isActiveRoute, readingTime}