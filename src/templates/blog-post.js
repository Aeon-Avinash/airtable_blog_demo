import React from "react"
import { Link, graphql } from "gatsby"

import unified from 'unified'
import markdown from 'remark-parse'
import html from 'remark-html'
// import Img from 'gatsby-image'

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.airtable.data
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={post.title}
          description={post.description || String(unified()
            .use(markdown)
            .use(html)
            .processSync(post.PostMarkdown.split(/\s+/).slice(0, 35).join(" ")))}
        />
        <h1>{post.title}</h1>
        <p
          style={{
            ...scale(-1 / 5),
            display: `block`,
            marginBottom: rhythm(1),
            marginTop: rhythm(-1),
          }}
        >
          {post.date}
        </p>

        <img src={post.image[0].url} alt={post.title} width={600} style={{display: "block", margin: "20px auto"}}/>
        <div dangerouslySetInnerHTML={{ 
          __html: unified()
            .use(markdown)
            .use(html)
            .processSync(post.PostMarkdown) 
          }} 
        />
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <Bio />

        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.data.slug} rel="prev">
                ← {previous.data.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.data.slug} rel="next">
                {next.data.title} →
              </Link>
            )}
          </li>
        </ul>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    airtable(data: {slug: {eq: $slug}}) {
      data {
        slug
        title
        author
        date
        image {
          url
        }
        PostMarkdown
      }
    }
  }
`
