import { defineType, defineField } from 'sanity';
import { UserIcon } from 'lucide-react'; 

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).error('Name must be at least 2 characters'),
    }),
    defineField({
      name: 'username',
      title: 'Username',
      type: 'string',
      validation: (Rule) => Rule.required().regex(/^[A-Za-z0-9_]+$/, {
        name: 'alphanumeric',
        invert: false,
      }).error('Username must be alphanumeric with underscores only'),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email().error('Must be a valid email'),
    }),
    defineField({
      name: 'image',
      title: 'Profile Image',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }).error('Must be a valid URL'),
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text',
      rows: 4, 
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'username',
      media: 'image',
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title || 'Unnamed Author',
        subtitle: subtitle || 'No username',
      };
    },
  },
});