// File: src/screens/DoctorConsultation.jsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Pressable,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather'; // or your preferred icon library
import Header from '../components/Header';

// You'll need to add these doctor images to your assets
const DOC1 = require('../../assets/doc1.png');
const DOC2 = require('../../assets/doc2.png');
const DOC3 = require('../../assets/doc3.png');
const DOC4 = require('../../assets/doc4.png');

export default function DoctorConsultation() {
    const navigation = useNavigation();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchText, setSearchText] = useState('');

    const categories = ['All', 'General', 'Cardiologist', 'Paediatrics'];

    const doctors = [
        {
            id: '1',
            name: 'Dr. Michael Chen',
            specialty: 'General Physician',
            experience: '12 years experience',
            rating: '4.8',
            location: 'Jumeirah Medical Center',
            nextAvailable: 'Today, 4:30 PM',
            price: 'AED 180',
            avatar: DOC1,
        },
        {
            id: '2',
            name: 'Dr. Sarah Williams',
            specialty: 'Cardiologist',
            experience: '15 years experience',
            rating: '4.8',
            location: 'Dubai Healthcare City',
            nextAvailable: 'Today, 2:00 PM',
            price: 'AED 200',
            avatar: DOC2,
        },
        {
            id: '3',
            name: 'Dr. Emma Thompson',
            specialty: 'Pediatrician',
            experience: '18 years experience',
            rating: '4.9',
            location: 'Dubai Marina Clinic',
            nextAvailable: 'Tomorrow',
            price: 'AED 250',
            avatar: DOC3,
        },
        {
            id: '4',
            name: 'Dr. Adam Kael',
            specialty: 'Neurologist',
            experience: '21 years experience',
            rating: '4.6',
            location: 'NeuroVista Center',
            nextAvailable: 'Tomorrow',
            price: 'AED 281',
            avatar: DOC4,
        },
    ];

    const filteredDoctors = doctors.filter(doctor => {
        const matchesCategory = selectedCategory === 'All' ||
            doctor.specialty.toLowerCase().includes(selectedCategory.toLowerCase());
        const matchesSearch = doctor.name.toLowerCase().includes(searchText.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(searchText.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const CategoryTab = ({ title, isSelected, onPress }) => (
        <Pressable
            style={[styles.categoryTab, isSelected && styles.categoryTabSelected]}
            onPress={onPress}
        >
            <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                {title}
            </Text>
        </Pressable>
    );

    const DoctorCard = ({ doctor }) => (
        <View style={styles.doctorCard}>
            <View style={styles.doctorHeader}>
                <Image source={doctor.avatar} style={styles.doctorAvatar} />
                <View style={styles.doctorInfo}>
                    <Text style={styles.doctorName}>{doctor.name}</Text>
                    <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>

                    <View style={styles.detailRow}>
                        <Icon name="briefcase" size={14} color="#9CA3AF" />
                        <Text style={styles.detailText}>{doctor.experience}</Text>
                        <View style={styles.ratingContainer}>
                            <Icon name="star" size={14} color="#F59E0B" />
                            <Text style={styles.ratingText}>{doctor.rating}</Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <Icon name="map-pin" size={14} color="#9CA3AF" />
                        <Text style={styles.detailText}>{doctor.location}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Icon name="clock" size={14} color="#9CA3AF" />
                        <Text style={styles.detailText}>Next available: {doctor.nextAvailable}</Text>
                    </View>
                    <View style={styles.doctorFooter}>
                        <Text style={styles.doctorPrice}>{doctor.price}</Text>
                        <Pressable style={styles.bookButton}>
                            <Text style={styles.bookButtonText}>Book Now</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <Header
                variant="standard"
                title="Dr Consultation"
                leftIcon="back"
                onLeftPress={() => navigation.goBack()}
                onNotificationPress={() => navigation.navigate('Notifications')}
                onMenuPress={() => navigation.toggleDrawer?.()}
            />

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Icon name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search here..."
                        placeholderTextColor="#9CA3AF"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>
            </View>

            {/* Category Tabs */}
            <View style={styles.categoryContainer}>
                <Text style={styles.sectionTitle}>Select Doctor</Text>
                <Pressable style={styles.filterButton}>
                    <Icon name="sliders" size={18} color="#6366F1" />
                </Pressable>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
                contentContainerStyle={styles.categoriesContent}
            >
                {categories.map((category) => (
                    <CategoryTab
                        key={category}
                        title={category}
                        isSelected={selectedCategory === category}
                        onPress={() => setSelectedCategory(category)}
                    />
                ))}
            </ScrollView>

            {/* Doctors List */}
            <ScrollView
                style={styles.doctorsScroll}
                contentContainerStyle={styles.doctorsContent}
                showsVerticalScrollIndicator={false}
            >
                {filteredDoctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },


    // Search Styles
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#F8FAFC',
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
        fontWeight: '400',
    },

    // Category Styles
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        // paddingTop: 24,
        paddingBottom: 16,
        backgroundColor: '#F8FAFC',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    filterButton: {
        padding: 4,
    },
    categoriesScroll: {
        backgroundColor: '#F8FAFC',
        maxHeight: 50,
    },
    categoriesContent: {
        paddingHorizontal: 16,
        paddingBottom: 8,
        alignItems: 'center',
    },
    categoryTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 4,
        borderRadius: 18,
        backgroundColor: 'transparent',
        minHeight: 36,
        justifyContent: 'center',
    },
    categoryTabSelected: {
        backgroundColor: '#6366F1',
    },
    categoryText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
        textAlign: 'center',
    },
    categoryTextSelected: {
        color: '#FFFFFF',
    },

    // Doctors List Styles
    doctorsScroll: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        marginBottom: 40
    },
    doctorsContent: {
        padding: 20,
        // marginBottom: 200
    },

    // Doctor Card Styles
    doctorCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        // padding: 20,
        // paddingBottom: 20,
        paddingTop: 20,
        paddingInlineStart: 0,
        paddingInlineEnd: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    doctorHeader: {
        flexDirection: 'row',
        // marginBottom: 20,
    },
    doctorAvatar: {
        width: '35%',
        // height: 70,
        borderRadius: 12,
        marginRight: 16,
    },
    doctorInfo: {
        flex: 1,
    },
    doctorName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    doctorSpecialty: {
        fontSize: 14,
        color: '#8B5CF6',
        marginBottom: 12,
        fontWeight: '500',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    detailText: {
        fontSize: 13,
        color: '#6B7280',
        marginLeft: 8,
        flex: 1,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
    },
    ratingText: {
        fontSize: 13,
        color: '#F59E0B',
        marginLeft: 4,
        fontWeight: '600',
    },
    doctorFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10
    },
    doctorPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    bookButton: {
        backgroundColor: '#8B5CF6',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        shadowColor: '#8B5CF6',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    bookButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
});