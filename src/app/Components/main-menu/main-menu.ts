import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, computed, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.html',
  styleUrl: `./main-menu.css`,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainMenu {
  feedbackForm: FormGroup;
  // FIX: Use inject() to correctly inject FormBuilder in this environment
  private fb: FormBuilder = inject(FormBuilder); 

  // Using Angular Signals for state management
  submissionStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  isSubmitting = computed(() => this.submissionStatus() === 'loading');

  statusMessage = computed(() => {
    switch (this.submissionStatus()) {
        case 'loading':
            return 'Sending feedback...';
        case 'success':
            return '✅ Success! Your feedback has been submitted. Thank you!';
        case 'error':
            return '❌ Error! There was a problem submitting your feedback. Please try again.';
        default:
            return '';
    }
  });


  ratingFields: string[] = [
    'Front Office',
    'Bell Desk',
    'Limelight',
    "Lido's Bar & Grill",
    'The Espresso Lab',
    'Food Taste & Quality',
    'Room Dinning',
    'Room Cleanliness & Amenities',
    'Kairali Ayurvedic Spa',
    'Beauty Saloon',
    'Fitness Center',
    'Overall Hotel rating'
  ];

  // FIX: Constructor no longer takes FormBuilder as an argument
  constructor() {
    const group: any = {
      // Required fields
      date: ['', Validators.required],
      roomNo: ['', Validators.required],
      guestName: ['', Validators.required],
      // Optional fields
      comments: [''],
      signature: ['']
    };

    // Add rating controls, marking them as required
    
    this.feedbackForm = this.fb.group(group);

    // Effect to clear status after a success/error message
    effect(() => {
        if (this.submissionStatus() === 'success' || this.submissionStatus() === 'error') {
            setTimeout(() => this.submissionStatus.set('idle'), 5000);
        }
    });
  }

  // Helper function to convert JSON form data to URLSearchParams (FormData equivalent for fetch)
  private convertJsonToFormData(data: any): URLSearchParams {
    const params = new URLSearchParams();
    for (const key in data) {
      if (data.hasOwnProperty(key) && data[key] !== null && data[key] !== undefined) {
        params.append(key, data[key]);
      }
    }
    return params;
  }

  // Logic to allow users to un-select a radio button (by clicking the active button again)
  toggle(field: string, value: string): void {
    const control = this.feedbackForm.get(field);
    if (control?.value === value) {
      control.setValue('');
    } else {
      control?.setValue(value);
    }
    control?.markAsDirty();
    control?.markAsTouched();
  }

  onSubmit() {
    // Manually mark all controls as touched to show validation messages
    this.feedbackForm.markAllAsTouched();

    if (this.feedbackForm.invalid) {
      console.error('Form is invalid. Cannot submit.');
      return;
    }

    this.submissionStatus.set('loading');
    const formData = this.feedbackForm.value;
    
    // CRITICAL: PASTE THE NEW DEPLOYED GOOGLE WEB APP URL HERE
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzjQyI8EmcbfDDft4MvaeXGF4bIicFxSttvKdh3_Irm47ySLYrX-njL0wUPGuyp2390PQ/exec';
    
    const body = this.convertJsonToFormData(formData);

    // Using fetch with 'no-cors' to communicate with the App Script
    fetch(scriptURL, {
      method: 'POST',
      mode: 'no-cors', // Important for cross-origin submission to App Script
      body: body,
    })
    .then(() => {
      console.log('Success! Network request initiated. Check Google Sheet for confirmation.');
      this.submissionStatus.set('success');
      this.feedbackForm.reset();
      this.feedbackForm.markAsPristine(); // Resets validation state
    })
    .catch((err) => {
      console.error('Error! A network error occurred.', err);
      this.submissionStatus.set('error');
    });
  }
}
