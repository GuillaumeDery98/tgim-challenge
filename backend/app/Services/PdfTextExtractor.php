<?php

namespace App\Services;

use Smalot\PdfParser\Parser;

class PdfTextExtractor
{
    public function __construct(private ?Parser $parser = null)
    {
        $this->parser = $this->parser ?: new Parser();
    }

    public function extract(string $filePath): string
    {
        $pdf = $this->parser->parseFile($filePath);
        $text = $pdf->getText();
        // Normalize whitespace a bit
        $text = preg_replace('/\s+/', ' ', (string) $text);
        return trim((string) $text);
    }
}
