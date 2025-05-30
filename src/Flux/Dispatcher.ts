// Definimos la estructura básica de una acción que se enviará al Dispatcher
export interface Action {
  type: string;      // Tipo de acción (por ejemplo: "LOGIN", "NAVIGATE", etc.)
  payload?: any;     // Datos opcionales que la acción puede llevar
}

export class Dispatcher {
  // Aquí guardamos todas las funciones que quieren escuchar las acciones
  private _listeners: Array<(action: Action) => void>;

  constructor() {
    this._listeners = []; // Inicialmente no hay escuchas registradas
  }

  // Método para que los componentes o stores se registren y puedan recibir acciones
  register(callback: (action: Action) => void): void {
    this._listeners.push(callback); // Guardamos la función que se ejecutará cuando llegue una acción
  }

  // Cuando alguien envía una acción, este método se encarga de avisar a todos los registrados
  dispatch(action: Action): void {
    for (const listener of this._listeners) {
      listener(action); // Ejecutamos la función de cada listener pasando la acción para que respondan
    }
  }
}


export const AppDispatcher = new Dispatcher();
