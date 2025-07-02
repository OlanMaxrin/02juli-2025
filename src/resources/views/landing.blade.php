@extends('components.layouts.app')

@section('content')
    @livewire('landing.hero')
    @livewire('landing.target')
    @livewire('landing.features')
    @livewire('landing.courses')
    @livewire('landing.instructors')
    @livewire('landing.pricing')
    @livewire('landing.testimonials')
    @livewire('landing.faq')
@endsection