export const STARTUP_QUERY = `*[ 
  _type == "startup" && 
  defined(slug.current) && 
  (
    !defined($search) || 
    title match $search || 
    category match $search || 
    author->name match $search
  )
] | order(_createdAt desc) {
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, image, bio
  }, 
  views,
  description,
  category,
  image,
}`;

export const STARTUP_BY_ID_QUERY = `*[_type == "startup" && _id == $id][0]{
  _id,
  title,
  views,
  slug,
  description,
  _createdAt,
  image,
  author -> {
    _id, name, username, image, bio
  },
  category,
  image,
  pitch
}`;

export const STARTUP_VIEWS_QUERY = `*[_type == "startup" && _id == $id][0]{
  _id,
  views
}`;

export const AUTHOR_BY_GITHUB_ID_QUERY = `*[_type == "author" && githubId == $id][0]{
  _id,
  githubId,
  name,
  username,
  email,
  image,
  bio,
}`;
export const AUTHOR_BY_ID_QUERY = `*[_type == "author" && _id == $id][0]{
  _id,
  githubId,
  name,
  username,
  email,
  image,
  bio,
}`;
export const STARTUPS_BY_AUTHOR_QUERY = `*[_type == "startup" && author._ref == $id] | order(_createdAt desc) {
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, image, bio
  }, 
  views,
  description,
  category,
  image,
}`;

export const PLAYLIST_BY_SLUG_QUERY =
  `*[_type == "playlist" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  select[] -> {
    _id,
    _createdAt,
    title,
    slug,
    author->{
      _id,
      name,
      slug,
      image,
      bio
    },
    views,
    description,
    category,
    image,
    pitch
  }
}`;