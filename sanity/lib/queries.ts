import {defineQuery} from "next-sanity"
export const STARTUP_QUERY = 
defineQuery(`
  *[_type == "startup" && defined(slug.current) 
    && (!defined($search) || category match $search || title match $search  || author->name match $search)
  ] | order(_createdAt desc) {
    _id,
    title,
    views,
    slug,
    description,
    _createdAt,
    image,
    author ->{
      _id, name, image, bio
    },
    category
  }
`)
export const STARTUP_BY_ID_QUERY = (`*[_type == "startup" && _id == $id][0]{
  _id,
    title,
    views,
    slug,
    description,
    _createdAt,
    image,
    author ->{
      _id, name,username, image, bio
    },
    category,
    image,
    pitch
}`)
