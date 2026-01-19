# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

**Deploy to Netlify**

This project is configured for Netlify deployment. Follow these steps:

1. **Push your code to GitHub** (if not already done)

2. **Connect to Netlify:**
   - Go to [Netlify](https://www.netlify.com/)
   - Click "Add new site" > "Import an existing project"
   - Connect your GitHub repository
   - Netlify will automatically detect the build settings from `netlify.toml`

3. **Set Environment Variables:**
   - In Netlify, go to Site settings > Environment variables
   - Add the following variables:
     - `VITE_SUPABASE_URL` - Your Supabase project URL
     - `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon/public key
   - You can find these in your Supabase project settings under API

4. **Deploy:**
   - Netlify will automatically build and deploy your site
   - The build command is: `npm run build`
   - Publish directory is: `dist`

5. **Configure Custom Domain (optional):**
   - In Netlify, go to Site settings > Domain management
   - Click "Add custom domain" and follow the instructions

**Alternative: Deploy via Lovable**

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.
