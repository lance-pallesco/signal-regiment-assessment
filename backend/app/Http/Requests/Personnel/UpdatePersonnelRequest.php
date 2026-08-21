<?php

namespace App\Http\Requests\Personnel;

use App\Models\Personnel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePersonnelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $personnelParam = $this->route('personnel');
        $personnelId = $personnelParam instanceof Personnel ? $personnelParam->id : $personnelParam;

        return [
            'serial_number'      => [
                'required',
                'string',
                'max:50',
                Rule::unique('personnel', 'serial_number')->ignore($personnelId),
            ],
            'first_name'         => ['required', 'string', 'min:2', 'max:100'],
            'last_name'          => ['required', 'string', 'min:2', 'max:100'],
            'rank'               => ['required', 'string', 'exists:ranks,code'],
            'birthday'           => ['required', 'date', 'before:today'],
            'gender'             => ['required', Rule::in(['Male', 'Female'])],
            'civil_status'       => ['required', Rule::in(['Single', 'Married', 'Widowed', 'Separated', 'Divorced'])],
            'phone'              => ['required', 'string', 'regex:/^[0-9+]+$/', 'min:7', 'max:20'],
            'email'              => ['nullable', 'email', 'max:150'],
            'address'            => ['required', 'string', 'min:5', 'max:500'],
            'unit'               => ['required', 'string', 'max:150'],
            'position'           => ['required', 'string', 'min:2', 'max:150'],
            'date_of_enlistment' => ['required', 'date', 'before_or_equal:today', 'after:birthday'],
            'status'             => ['required', Rule::in(['Active', 'Reserve', 'AWOL', 'Retired'])],
            'photo'              => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }
}
