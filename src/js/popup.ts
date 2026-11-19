import { _browser, storage } from './helper.js';

// Define an interface for the expected structure of the options object
interface Options {
  defaultOption: number;
  lastTicket: string;
}

interface CustomHTMLElement extends HTMLInputElement {
  newTab?: boolean; // Use optional chaining if you want it to be optional
}

interface Message {
  action: string;
  ticket: string;
  newTab: boolean;
}

const handleSubmit = (event?: Event) => {
  if (event) {
    event.preventDefault();
  }

  const ticketInput = document.querySelector<HTMLInputElement>('.quiji-ticket-id');
  const ticket = ticketInput ? encodeURIComponent(ticketInput.value) : '';

  if (ticket) {
    window.setTimeout(() => {
      window.close();
    }, 1000);

    // Use a type assertion to ensure event.target is an HTMLElement
    const newTab: boolean = (event?.target as CustomHTMLElement).newTab ?? false;

    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    void (_browser.runtime as typeof chrome.runtime).sendMessage<Message, void>({
      action: 'openTicket',
      ticket: ticket,
      newTab: newTab,
    });
  }
};

const handleLastTicket = (event?: Event, defaultOption?: number, lastTicket?: string) => {
  if (event) {
    event.preventDefault();
  }

  window.setTimeout(() => {
    window.close();
  }, 1000);

  if (lastTicket) {
    void (_browser.runtime as typeof chrome.runtime).sendMessage<Message, ResponseType>({
      action: 'openTicket',
      ticket: lastTicket,
      newTab: defaultOption !== 0,
    });
  }
};

const renderDialog = async () => {
  await storage.get(
    {
      defaultOption: 0,
      lastTicket: '',
    },
    (options) => {
      // Type the options parameter
      const form = document.querySelector<HTMLFormElement>('.quiji-popup-form');
      const newButton = document.querySelector<CustomHTMLElement>('.quiji-new-tab');
      const currentButton = document.querySelector<CustomHTMLElement>('.quiji-current-tab');
      const lastTicketButton = createLastTicketButton(options as Options);

      if (newButton && currentButton && form) {
        newButton.newTab = true;
        currentButton.newTab = false;

        form.addEventListener('submit', handleSubmit);
        newButton.addEventListener('click', handleSubmit);
        currentButton.addEventListener('click', handleSubmit);

        // Depending on the option, attach newTab true or false to submit handler
        form.newTab = options.defaultOption === 0 ? false : true;

        newButton.value = _browser.i18n.getMessage('newTab');
        currentButton.value = _browser.i18n.getMessage('currentTab');
        lastTicketButton.value = _browser.i18n.getMessage('lastTicket');

        const focusTicketInput = () => {
          document.querySelector<HTMLInputElement>('#quiji-ticket-id')?.focus();
        };
        setTimeout(focusTicketInput, 0);
        // Firefox can activate the popup frame after the call above, which drops the input's focus (Mozilla bug 1324255)
        window.addEventListener('focus', focusTicketInput, { once: true });
      }
    },
  );
};

document.addEventListener('DOMContentLoaded', () => {
  void renderDialog();
});

function createLastTicketButton(options?: Options) {
  const lastTicketButton = document.querySelector<HTMLButtonElement>('.quiji-last-ticket');

  if (options && lastTicketButton) {
    if (!options.lastTicket) {
      lastTicketButton.disabled = true;
    } else {
      lastTicketButton.addEventListener('click', (e) => {
        handleLastTicket(e, options.defaultOption, options.lastTicket);
      });
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return lastTicketButton!;
}
