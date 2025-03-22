import { defineType, defineField } from 'sanity';

export const startup = defineType({
  name: 'startup',
  title: 'Startup',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).error('Title must be at least 2 characters'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('Slug is required'),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' },
      validation: (Rule) => Rule.required().error('Author is required'),
    }),
    defineField({
      name: 'views',
      title: 'Views',
      type: 'number',
      validation: (Rule) => Rule.min(0).error('Views cannot be negative'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required().min(10).error('Description must be at least 10 characters'),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      validation: (Rule) =>
        Rule.required().min(1).max(20).error('Category must be between 1 and 20 characters'),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }).error('Must be a valid URL'),
    }),
    defineField({
      name: 'pitch',
      title: 'Pitch',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required().error('Pitch is required'),
    }),
  ],
});