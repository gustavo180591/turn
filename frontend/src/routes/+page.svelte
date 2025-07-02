<script>
  import { crearTurno, listarTurnos, atenderRegistro, atenderInmueble, finalizarTurno } from '$lib/api.js';
  import { onMount } from 'svelte';
  
  let nombre = '';
  let filaRegistro = [];
  let filaInmueble = [];

  async function cargarFilas() {
    filaRegistro = await listarTurnos('en_fila_registro');
    filaInmueble = await listarTurnos('en_fila_inmueble');
  }

  async function crear() {
    if (nombre.trim()) {
      await crearTurno(nombre);
      nombre = '';
      await cargarFilas();
    }
  }

  async function atenderReg(id) {
    await atenderRegistro(id);
    await cargarFilas();
  }

  async function atenderInm(id) {
    await atenderInmueble(id);
    await cargarFilas();
  }

  async function finalizar(id) {
    await finalizarTurno(id);
    await cargarFilas();
  }

  onMount(cargarFilas);
</script>

<main class="p-8 max-w-2xl mx-auto">
  <h1 class="text-2xl font-bold mb-4">Sistema de Turnos – Doble Fila</h1>
  <div class="mb-6">
    <input
      class="border p-2 mr-2"
      placeholder="Nombre del usuario"
      bind:value={nombre}
      on:keydown={(e) => e.key === 'Enter' && crear()}
    />
    <button class="bg-blue-600 text-white px-4 py-2 rounded" on:click={crear}>Crear turno</button>
  </div>

  <div class="mb-8">
    <h2 class="font-semibold mb-2">Fila de Registro</h2>
    <ul>
      {#each filaRegistro as turno}
        <li class="mb-2 flex items-center">
          <span class="flex-1">{turno.nombre_usuario}</span>
          <button class="bg-green-600 text-white px-2 py-1 rounded" on:click={() => atenderReg(turno.id)}>
            Atender y pasar a Inmueble
          </button>
        </li>
      {/each}
      {#if filaRegistro.length === 0}
        <li class="text-gray-500">No hay turnos en esta fila.</li>
      {/if}
    </ul>
  </div>

  <div>
    <h2 class="font-semibold mb-2">Fila de Inmueble</h2>
    <ul>
      {#each filaInmueble as turno}
        <li class="mb-2 flex items-center">
          <span class="flex-1">{turno.nombre_usuario}</span>
          <button class="bg-yellow-600 text-white px-2 py-1 rounded mr-2" on:click={() => atenderInm(turno.id)}>
            Atender Inmueble
          </button>
          <button class="bg-gray-800 text-white px-2 py-1 rounded" on:click={() => finalizar(turno.id)}>
            Finalizar
          </button>
        </li>
      {/each}
      {#if filaInmueble.length === 0}
        <li class="text-gray-500">No hay turnos en esta fila.</li>
      {/if}
    </ul>
  </div>
</main>