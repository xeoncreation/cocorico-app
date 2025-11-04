// API route to clean and standardize recipe content using OpenAI
import { NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const lastCall: Record<string, number> = {};

const systemPrompt = `You are a helpful cooking assistant that standardizes recipe content.
Your task is to take a recipe and return a cleaned version that:

1. Has a consistent format and structure
2. Uses standard measurements
3. Has clear, step-by-step instructions
4. Includes prep time, cook time, and servings
5. Lists ingredients in a clear format
6. Maintains factual accuracy of the original recipe

Please provide output in this JSON format:
{
  "title": "string",
  "description": "string", 
  "prepTime": "string (in minutes)",
  "cookTime": "string (in minutes)",
  "servings": number,
  "ingredients": [
    {
      "item": "string",
      "amount": "string",
      "unit": "string"
    }
  ],
  "instructions": [
    "string"
  ],
  "notes": "string (optional)"
}`;

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Recipe content is required' }), 
        { status: 400 }
      );
    }
    
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }), 
        { status: 401 }
      );
    }

    const now = Date.now();
    const last = lastCall[session.user.id] || 0;
    if (now - last < 8000) {
      return new Response(
        JSON.stringify({ error: 'Por favor espera unos segundos antes de hacer otra petición' }), 
        { status: 429 }
      );
    }
    lastCall[session.user.id] = now;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user", 
          content: content
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const cleanedRecipe = completion.choices[0].message.content;

    return new Response(cleanedRecipe, {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error cleaning recipe:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to clean recipe' }), 
      { status: 500 }
    );
  }
}