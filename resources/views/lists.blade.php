@extends('layouts.app')

@section('content')
    <main class="grid-containter">
        <section class="cell-block-container topics">
            <div class="grid-x">
                <div class="cell topic small-3"><h2>Topic 1</h2></div>
                <div class="cell topic small-3"><h2>Topic 2</h2></div>
                <div class="cell topic small-3"><h2>Topic 3</h2></div>
                <div class="cell topic small-3"><h2>Topic 4</h2></div>
                <div class="cell topic small-3"><h2>Topic 5</h2></div>
                <div class="cell topic small-3"><h2>Topic 6</h2></div>
            </div>
        </section>
        <section>
            <div class="grid-y">
                <div class="cell">
                    <a class="twitter-timeline" href="https://twitter.com/CryptoBull/lists/crypto">A Twitter List by CryptoBull</a>
                </div>
                <div class="cell"><h2>Timeline</h2></div>
                <div class="cell"><h2>Timeline</h2></div>
            </div>
        </section>
    </main>
@endsection
