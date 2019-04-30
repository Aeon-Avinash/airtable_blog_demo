import React from "react"
import { graphql } from "gatsby"
import Airtable from "airtable"

import Layout from "../components/layout"
import SEO from "../components/seo"

const AIRTABLE_API_KEY =
  process.env.AIRTABLE_API_KEY || process.env.GATSBY_AIRTABLE_API_KEY
const CONTACT_BASE_ID =
  process.env.CONTACT_BASE_ID || process.env.GATSBY_CONTACT_BASE_ID

class Contact extends React.Component {
  state = {
    nameairgats: "",
    emailairgats: "",
    notesairgats: "",
    name: "",
    email: "",
    notes: "",
  }

  changeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  submitHandler = e => {
    e.preventDefault()

    if (
      this.state.name === "" &&
      this.state.email === "" &&
      this.state.notes === ""
    ) {
      const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(
        CONTACT_BASE_ID
      )

      base("Contact Records").create(
        {
          name: this.state.nameairgats,
          email: this.state.emailairgats,
          notes: this.state.notesairgats,
        },
        (err, record) => {
          if (err) {
            console.error(err)
            return
          }
          console.log(record.getId())
          this.setState({
            name: "",
            email: "",
            notes: "",
          })
        }
      )
    } else {
      console.log("Honeypot detected spam attack!")
    }
  }

  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title

    const ohnohoney = {
      opacity: 0,
      position: "absolute",
      top: 0,
      left: 0,
      height: 0,
      width: 0,
      zIndex: -1,
    }

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="Contact Page" />
        <h1>Contact Form</h1>
        <p>
          If you have any queries or interest in Gatsby development, please get
          in touch with us:
        </p>

        <form
          onSubmit={this.submitHandler}
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "50px auto",
            justifyContent: "center",
            alignItems: "space-evenly",
          }}
        >
          <label htmlFor="nameairgats" style={{ marginBottom: "18px" }}>
            Name &nbsp;&nbsp;
            <input
              type="text"
              name="nameairgats"
              id="nameairgats"
              maxLength="100"
              placeholder="Your name here"
              onChange={this.changeHandler}
              value={this.state.nameairgats}
            />
          </label>
          <label htmlFor="emailairgats" style={{ marginBottom: "18px" }}>
            Email &nbsp;&nbsp;
            <input
              type="email"
              name="emailairgats"
              id="emailairgats"
              placeholder="Your e-mail here"
              onChange={this.changeHandler}
              value={this.state.emailairgats}
            />
          </label>
          <label htmlFor="notesairgats" style={{ marginBottom: "18px" }}>
            Notes &nbsp;&nbsp;
            <textarea
              name="notesairgats"
              id="notesairgats"
              placeholder="Your notes here"
              onChange={this.changeHandler}
              value={this.state.notesairgats}
            />
          </label>

          <label style={ohnohoney} htmlFor="name">
            Name &nbsp;&nbsp;
            <input
              style={ohnohoney}
              type="text"
              name="name"
              id="name"
              placeholder="Your name here"
              autoComplete="off"
              onChange={this.changeHandler}
              value={this.state.name}
            />
          </label>
          <label style={ohnohoney} htmlFor="email">
            Email &nbsp;&nbsp;
            <input
              style={ohnohoney}
              type="text"
              name="email"
              id="email"
              placeholder="Your e-mail here"
              autoComplete="off"
              onChange={this.changeHandler}
              value={this.state.email}
            />
          </label>
          <label style={ohnohoney} htmlFor="notes">
            Notes &nbsp;&nbsp;
            <textarea
              style={ohnohoney}
              name="notes"
              id="notes"
              placeholder="Your notes here"
              autoComplete="off"
              onChange={this.changeHandler}
              value={this.state.notes}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </Layout>
    )
  }
}

export default Contact

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
