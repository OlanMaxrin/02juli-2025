<!DOCTYPE html>
<html lang="en" data-theme="light">

@include('components.layouts.partials.head')

<body class="bg-base-100 text-base-content">

    <!-- Navbar -->
    @include('components.layouts.partials.countainer')

    <!-- Page Content -->
    @yield('content')

    <!-- Footer -->
    @include('components.layouts.partials.footer')

    <!-- Livewire Scripts -->
    @include('components.layouts.partials.scripts')
</body>

</html>