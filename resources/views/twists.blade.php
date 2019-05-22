@extends('layouts.app')

@section('content')
<main class="grid-container">
    <section class="grid-x">
        <div class="cell medium-3 medium-order-1" data-sticky-container>
            <div data-sticky data-margin-top="3" data-top-anchor="header:bottom" data-sticky-on="small">
                <ul class="menu topics__list">
                    <li class="h1 menu-text hide-for-small-only">Topics</li>
                    {{-- li.h2{Topic $}*6*6 --}}
                    <li class="topic">
                        <h2 class="show-for-small-only">Topic 1</h2>
                        <h3 class="hide-for-small-only">Topic 1</h3>
                    </li>
                    <li class="topic">
                        <h2 class="show-for-small-only">Topic 2</h2>
                        <h3 class="hide-for-small-only">Topic 2</h3>
                    </li>
                    <li class="topic">
                        <h2 class="show-for-small-only">Topic 3</h2>
                        <h3 class="hide-for-small-only">Topic 3</h3>
                    </li>
                    <li class="topic">
                        <h2 class="show-for-small-only">Topic 4</h2>
                        <h3 class="hide-for-small-only">Topic 4</h3>
                    </li>
                    <li class="topic">
                        <h2 class="show-for-small-only">Topic 5</h2>
                        <h3 class="hide-for-small-only">Topic 5</h3>
                    </li>
                    <li class="topic">
                        <h2 class="show-for-small-only">Topic 6</h2>
                        <h3 class="hide-for-small-only">Topic 6</h3>
                    </li>
                </ul>
                <ul class="menu sub-topics__list hide-for-small-only">
                    <li class="h4 menu-text">Sub-Topics</li>
                    <li class="h5">Sub-Topic 1</li>
                    <li class="h5">Sub-Topic 2</li>
                    <li class="h5">Sub-Topic 3</li>
                    <li class="h5">Sub-Topic 4</li>
                    <li class="h5">Sub-Topic 5</li>
                    <li class="h5">Sub-Topic 6</li>
                </ul>
            </div>
        </div>
        <div class="cell medium-9">
            <a class="twitter-timeline" href="https://twitter.com/CryptoBull/lists/crypto">A Twitter List by
                CryptoBull</a>
        </div>
    </section>
</main>
@endsection
