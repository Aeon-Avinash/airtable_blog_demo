import React from "react"
import { Link, graphql } from "gatsby"

import unified from "unified"
import markdown from "remark-parse"
// import html from "remark-html"
import remark2rehype from "remark-rehype"
import html from "rehype-stringify"
import h from "hastscript"
import toHTML from "hast-util-to-html"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

class BlogIndex extends React.Component {

  convertToHtml = (PostMarkdown) => { 
    const text = unified()
    .use(markdown)
    .use(remark2rehype)
    .use(html)
    .processSync(
      PostMarkdown.split(/\s+/)
          .slice(0, 20)
          .join(" ")
      );

    // very hacky solution to replace 
    // the original h1 tag with p tag
    const cleanedText = text.contents.split('<h1>')[1].split('</h1>')[0]
    const tree = h('p', cleanedText);
    return toHTML(tree); 
  } 

  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allAirtable.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="All posts"
          keywords={[`blog`, `gatsby`, `javascript`, `react`, `airtable`]}
        />
        <Bio />
        {posts.map(({ node }) => {
          const post = node.data
          const title = post.title || post.slug
          return (
            <div key={post.slug}>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{ boxShadow: `none` }} to={post.slug}>
                  {title}
                </Link>
              </h3>
              <small>{post.date}</small>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    backgroundImage: `url(${
                      post.image[0].thumbnails.large.url
                    })`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    height: post.image[0].thumbnails.small.height * 2,
                    flexBasis: "25%",
                    marginRight: "15px",
                  }}
                />
                <p
                  style={{ fontSize: "14px", flexBasis: "75%" }}
                  dangerouslySetInnerHTML={{
                    __html: this.convertToHtml(post.PostMarkdown)
                  }}
                />
              </div>
            </div>
          )
        })}
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allAirtable(filter: { data: { publishingStatus: { eq: "Publish" } } }) {
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
              thumbnails {
                small {
                  url
                  width
                  height
                }
                large {
                  url
                  width
                  height
                }
              }
            }
            PostMarkdown
            publishingStatus
          }
        }
      }
    }
  }
`
