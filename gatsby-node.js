const path = require(`path`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  return graphql(
    `
      {
        allAirtable(filter: {data: {publishingStatus: {eq: "Publish"}}}) {
          totalCount
          edges {
            node {
              table
              data {
                title
                author
                slug
                date
                image {
                  url
                }
                PostMarkdown
                publishingStatus
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog posts pages.
    const posts = result.data.allAirtable.edges

    posts.forEach(({node}, index) => {
      const post = node.data
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: `${post.slug}`,
        component: blogPost,
        context: {
          slug: post.slug,
          previous,
          next,
        },
      })
    })

    return null
  })
}
