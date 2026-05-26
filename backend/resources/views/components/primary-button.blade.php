<button {{ $attributes->merge(['type' => 'submit', 'class' => 'inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-700 border border-transparent rounded-lg font-semibold text-sm text-white uppercase tracking-wider hover:from-indigo-600 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 ease-in-out shadow-sm']) }}>
    {{ $slot }}
</button>
