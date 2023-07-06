import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Task {
  id: string;
  description: string;
  status: string;
}

const Atividades = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskDescription, setEditingTaskDescription] = useState('');
  const [showToggleStatus, setShowToggleStatus] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.log('Erro ao carregar as atividades', error);
    }
  };

  const saveTasks = async (newTasks: Task[]) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    } catch (error) {
      console.log('Erro ao salvar as atividades', error);
    }
  };

  const handleAddTask = () => {
    if (task.trim() !== '') {
      if (editingTaskId) {
        const updatedTasks = tasks.map(task => {
          if (task.id === editingTaskId) {
            return { ...task, description: editingTaskDescription };
          }
          return task;
        });
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
        setEditingTaskId(null);
        setEditingTaskDescription('');
        setShowToggleStatus(false); 
        return;
      }

      const newTask: Task = {
        id: Math.random().toString(),
        description: task,
        status: 'ativo',
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      setTask('');
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleToggleStatus = (taskId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'ativo' ? 'inativo' : 'ativo';
        return { ...task, status: newStatus };
      }
      return task;
    });
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleEditTask = (taskId: string) => {
    const taskToEdit = tasks.find(task => task.id === taskId);
    if (taskToEdit) {
      setEditingTaskId(taskId);
      setEditingTaskDescription(taskToEdit.description);
      setShowToggleStatus(true); 
    }
  };

  const handleSaveEditTask = () => {
    if (editingTaskId) {
      const updatedTasks = tasks.map(task => {
        if (task.id === editingTaskId) {
          return { ...task, description: editingTaskDescription };
        }
        return task;
      });
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      setEditingTaskId(null);
      setEditingTaskDescription('');
      setShowToggleStatus(false); 
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={task}
        onChangeText={text => setTask(text)}
        placeholder="Digite uma atividade"
      />
      <Button title="Adicionar" onPress={handleAddTask} />
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            {editingTaskId === item.id ? (
              <TextInput
                style={styles.taskDescription}
                value={editingTaskDescription}
                onChangeText={text => setEditingTaskDescription(text)}
              />
            ) : (
              <Text style={styles.taskDescription}>{item.description}</Text>
            )}
            {editingTaskId === item.id ? (
              <Button
                title="Salvar"
                onPress={handleSaveEditTask}
                
              />
            ) : (
              <Button
                title="Alterar"
                onPress={() => handleEditTask(item.id)}
               
              />
            )}
            {showToggleStatus && (
              <Button
                title={item.status === 'ativo' ? 'Inativar' : 'Ativar'}
                onPress={() => handleToggleStatus(item.id)}
               
              />
            )}
            <Button
              title="Excluir"
              onPress={() => handleDeleteTask(item.id)}
              
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  taskDescription: {
    flex: 1,
    marginRight: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#515151',
    borderRadius: 8,
  },
});

export default Atividades;
