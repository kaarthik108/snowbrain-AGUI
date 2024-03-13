<a href="https://sdk.vercel.ai/rsc-demo">
  <h1 align="center">snowBrain Generative UI Demo</h1>
</a>

<p align="center">
SnowBrain is an open-source prototype that serves as your personal data analyst.
</p>

## Features

- [Next.js](https://nextjs.org) App Router + React Server Components
- [Vercel AI SDK 3.0](https://sdk.vercel.ai/docs) for Generative UI
- OpenAI Tools/Function Calling
- [shadcn/ui](https://ui.shadcn.com)
- RAG - Retrieval Augmented Generation [Supabase](https://supabase.com/)
- Charts using [Tremor](https://tremor.so)
- Real time data retrieval using [Snowflake](https://www.snowflake.com/) deployed on [Modal](https://modal.com)

## Deploy Your Own

You can deploy your own version of the demo to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kaarthik108/snowbrain-AGUI&project-name=snowbrain&repo-name=snowbrain-agui)

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js AI Chatbot. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various OpenAI and authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`
4. Deploy the modal code on modal/main.py using the following command: `modal deploy`

```bash
bun install
bun run dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

## Example Queries

snowBrain is designed to make complex data querying simple. Here are some example queries you can try:

- **Total revenue per product category**: "Show me the total revenue for each product category."
- **Top customers by sales**: "Who are the top 10 customers by sales?"
- **Average order value per region**: "What is the average order value for each region?"
- **Order volume**: "How many orders were placed last week?"
- **Product price listing**: "Display the list of products with their prices."
