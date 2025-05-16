import { useState } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { toast } from 'react-toastify'

function TodoItem({ todo, onToggle, onDelete }) {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState(todo.reminder ? new Date(todo.reminder) : null)
  const [isSettingReminder, setIsSettingReminder] = useState(false)

  const handleSetReminder = async (date) => {
    if (!date) {
      toast.error('Please select a valid date and time')
      return
    }

    setIsSettingReminder(true)
    try {
      console.log('Setting reminder for todo:', todo.id, 'Date:', date.toISOString())
      
      const response = await fetch(`http://localhost:5000/todos/${todo.id}/reminder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          reminder: date.toISOString()
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to set reminder')
      }
      
      setSelectedDate(date)
      setShowDatePicker(false)
      
      const now = new Date()
      const timeUntilReminder = date.getTime() - now.getTime()
      
      if (timeUntilReminder > 0) {
        console.log('Scheduling notification for:', date.toLocaleString())
        setTimeout(() => {
          toast.info(`Reminder: ${todo.title}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          })
        }, timeUntilReminder)
        
        toast.success('Reminder set successfully!')
      } else {
        toast.warning('Selected time is in the past')
      }
    } catch (error) {
      console.error('Error setting reminder:', error)
      toast.error(error.message || 'Failed to set reminder')
    } finally {
      setIsSettingReminder(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo.id, todo.completed)}
              className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <h3 className={`ml-3 text-lg font-medium ${
              todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {todo.title}
            </h3>
          </div>
          {todo.description && (
            <p className={`mt-2 text-sm ${
              todo.completed ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {todo.description}
            </p>
          )}
          <div className="mt-2 flex items-center space-x-4">
            <p className="text-xs text-gray-400">
              Created: {new Date(todo.created_at).toLocaleString()}
            </p>
            {selectedDate && (
              <p className="text-xs text-blue-500">
                Reminder: {selectedDate.toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
            disabled={isSettingReminder}
          >
            Set Reminder
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
      {showDatePicker && (
        <div className="mt-4">
          <DatePicker
            selected={selectedDate}
            onChange={handleSetReminder}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholderText="Select date and time"
            minDate={new Date()}
            disabled={isSettingReminder}
          />
        </div>
      )}
    </div>
  )
}

export default TodoItem 