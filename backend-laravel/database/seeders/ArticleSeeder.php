<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use App\Models\Article;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Sample articles for demonstration since we can't scrape live without proper setup
        $sampleArticles = [
            [
                'title' => 'The Future of AI in Content Creation',
                'content' => 'Artificial intelligence is revolutionizing how we create and consume content. From automated writing to image generation, AI tools are becoming increasingly sophisticated. This article explores the current state of AI in content creation and what we can expect in the coming years.',
                'source_url' => 'https://beyondchats.com/blog/future-ai-content-creation',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Building Scalable Web Applications',
                'content' => 'Creating web applications that can handle growth requires careful planning and architecture. This guide covers essential principles for building scalable applications, including database optimization, caching strategies, and microservices architecture.',
                'source_url' => 'https://beyondchats.com/blog/scalable-web-applications',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Modern JavaScript Frameworks Comparison',
                'content' => 'JavaScript frameworks continue to evolve rapidly. This comprehensive comparison covers React, Vue, Angular, and emerging frameworks like Svelte and Solid.js. We examine performance, developer experience, and ecosystem maturity.',
                'source_url' => 'https://beyondchats.com/blog/javascript-frameworks-comparison',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'The Rise of No-Code Development',
                'content' => 'No-code and low-code platforms are democratizing software development. This article explores how these tools are changing the landscape, their limitations, and when traditional coding is still necessary.',
                'source_url' => 'https://beyondchats.com/blog/no-code-development',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Cybersecurity Best Practices for Developers',
                'content' => 'Security should be a primary concern for every developer. This article covers essential cybersecurity practices including secure coding guidelines, common vulnerabilities, and tools for maintaining application security.',
                'source_url' => 'https://beyondchats.com/blog/cybersecurity-best-practices',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($sampleArticles as $article) {
            Article::create($article);
        }
    }
}
