import React from 'react'
import { FormControl, FormField, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import {authFormSchema} from '@/lib/utils'
import { Control } from 'react-hook-form'
import {z} from 'zod';


const schema= authFormSchema('Sign Up')
type SchemaType = z.infer<typeof schema>

// Define the valid keys for the form fields
type FieldName = keyof SchemaType

interface CustomInputProps {
    control: Control<SchemaType>
    name: FieldName
    type: string
    placeholder: string
    label: string
}
const CustomInput = ({control,name,label,type,placeholder}:CustomInputProps) => {
  return (
    <div>
      <FormField
          control={control}
          name={name}
          render={({ field }) => (
                <div className='form-item'>
                    <FormLabel className='form-label'>
                        {label}
                    </FormLabel>
                    <FormControl>
                        <Input placeholder={placeholder} type={type} id={name} {...field} className='input-class' />
                    </FormControl>
                    <FormMessage className='form-message mt-3'/>
                </div>
            
          )}
        />
    </div>
  )
}

export default CustomInput
